"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Renders the Nataraja cut-out as a displaced 3D relief in WebGL.
 * - A dense grid mesh is pushed forward by a depth map (public/nataraja-depth.png).
 * - Normals are derived from the depth map so a cursor-driven light can
 *   travel across the gold surface.
 * - Pointer position tilts the statue; dragging turns it further. Both are
 *   driven by a damped spring so motion only ever follows the user's input.
 * The host element receives CSS variables (--rx, --ry, --lx, --ly) so
 * surrounding decoration can respond to the same motion.
 */

const VERT = `
attribute vec2 aPos;
uniform sampler2D uDepth;
uniform mat4 uProj;
uniform mat4 uModel;
uniform float uDepthScale;
uniform float uAspect;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x + 0.5, 0.5 - aPos.y);
  float d = texture2D(uDepth, vUv).r;
  vec3 p = vec3(aPos.x * uAspect, aPos.y, d * uDepthScale);
  gl_Position = uProj * uModel * vec4(p, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uTexel;
uniform vec3 uLight;
uniform float uDepthScale;
varying vec2 vUv;
void main() {
  vec4 c = texture2D(uColor, vUv);
  if (c.a < 0.45) discard;
  float l = texture2D(uDepth, vUv - vec2(uTexel.x, 0.0)).r;
  float r = texture2D(uDepth, vUv + vec2(uTexel.x, 0.0)).r;
  float t = texture2D(uDepth, vUv - vec2(0.0, uTexel.y)).r;
  float b = texture2D(uDepth, vUv + vec2(0.0, uTexel.y)).r;
  vec3 n = normalize(vec3((l - r) * 14.0 * uDepthScale, (b - t) * 14.0 * uDepthScale, 1.0));
  vec3 L = normalize(uLight);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(n, H), 0.0), 36.0);
  float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  vec3 col = c.rgb * (0.72 + 0.42 * diff) + spec * vec3(1.0, 0.86, 0.58) * (0.25 + lum) * 0.55;
  gl_FragColor = vec4(col, c.a);
}`;

type Mat = Float32Array;
const perspective = (fov: number, aspect: number, near: number, far: number): Mat => {
  const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
};
const model = (rx: number, ry: number, z: number): Mat => {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  // R = Rx * Ry, then translate along z (column-major)
  return new Float32Array([
    cy, sx * sy, -cx * sy, 0,
    0, cx, sx, 0,
    sy, -sx * cy, cx * cy, 0,
    0, 0, z, 1,
  ]);
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.decoding = "async";
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

export default function Statue3D({ src, depthSrc, alt, hostRef }: { src: string; depthSrc: string; alt: string; hostRef?: React.RefObject<HTMLElement | null> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const cv = canvas.current!, box = wrap.current!;
    const gl = cv.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) { setFallback(true); return; }
    let disposed = false, raf = 0, visible = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amp = reduce ? 0.35 : 1;

    const sh = (type: number, s: string) => {
      const o = gl.createShader(type)!; gl.shaderSource(o, s); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || "shader");
      return o;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
    } catch { setFallback(true); return; }
    gl.useProgram(prog);

    // Grid mesh
    const SX = 150, SY = 210;
    const verts = new Float32Array((SX + 1) * (SY + 1) * 2);
    let k = 0;
    for (let y = 0; y <= SY; y++) for (let x = 0; x <= SX; x++) { verts[k++] = x / SX - 0.5; verts[k++] = 0.5 - y / SY; }
    const idx = new Uint32Array(SX * SY * 6);
    k = 0;
    for (let y = 0; y < SY; y++) for (let x = 0; x < SX; x++) {
      const i = y * (SX + 1) + x;
      idx.set([i, i + 1, i + SX + 1, i + 1, i + SX + 2, i + SX + 1], k); k += 6;
    }
    const ext = gl.getExtension("OES_element_index_uint");
    if (!ext) { setFallback(true); return; }
    const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uProj = U("uProj"), uModel = U("uModel"), uLight = U("uLight"), uDepthScale = U("uDepthScale");
    const uAspect = U("uAspect"), uTexel = U("uTexel");
    gl.uniform1i(U("uColor"), 0); gl.uniform1i(U("uDepth"), 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const tex = (img: HTMLImageElement, unit: number) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };

    // Spring state: tilt (rx, ry) and light (lx, ly)
    const s = { rx: 0, ry: 0, vrx: 0, vry: 0, lx: 0.3, ly: 0.4, vlx: 0, vly: 0 };
    const target = { rx: 0, ry: 0, lx: 0.3, ly: 0.4 };
    let drag: null | { x: number; y: number; ry: number; rx: number } = null;
    let dragOffset = { rx: 0, ry: 0 };
    let imgAspect = 1048 / 1468;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = box.clientWidth, h = box.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniformMatrix4fv(uProj, false, perspective(0.62, w / h, 0.1, 10));
      kick();
    };

    const onMove = (e: PointerEvent) => {
      if (drag) {
        dragOffset = {
          ry: drag.ry + (e.clientX - drag.x) * 0.004,
          rx: drag.rx + (e.clientY - drag.y) * 0.003,
        };
        // soft limit: resistance grows toward the edge so the relief never turns side-on
        const soft = (v: number, lim: number) => lim * Math.tanh(v / lim);
        dragOffset.ry = soft(dragOffset.ry, 0.38);
        dragOffset.rx = soft(dragOffset.rx, 0.16);
      }
      const r = box.getBoundingClientRect();
      const nx = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 2;
      const ny = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 2;
      target.ry = Math.max(-1, Math.min(1, nx)) * 0.26 * amp + dragOffset.ry;
      target.rx = Math.max(-1, Math.min(1, ny)) * 0.14 * amp + dragOffset.rx;
      target.lx = Math.max(-1.2, Math.min(1.2, nx * 1.4));
      target.ly = Math.max(-1.2, Math.min(1.2, -ny * 1.4));
      kick();
    };
    const onDown = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, ry: dragOffset.ry, rx: dragOffset.rx };
      cv.setPointerCapture(e.pointerId);
      box.classList.add("is-dragging");
    };
    const onUp = () => {
      if (!drag) return;
      drag = null; dragOffset = { rx: 0, ry: 0 };
      box.classList.remove("is-dragging");
      target.rx *= 0.4; target.ry *= 0.4;
      kick();
    };

    let running = false;
    const kick = () => { if (!running && visible && !disposed) { running = true; raf = requestAnimationFrame(frame); } };
    const host = hostRef?.current ?? null;

    function frame() {
      // damped springs
      const K = drag ? 0.22 : 0.075, D = drag ? 0.62 : 0.8;
      s.vrx = (s.vrx + (target.rx - s.rx) * K) * D; s.rx += s.vrx;
      s.vry = (s.vry + (target.ry - s.ry) * K) * D; s.ry += s.vry;
      s.vlx = (s.vlx + (target.lx - s.lx) * 0.06) * 0.82; s.lx += s.vlx;
      s.vly = (s.vly + (target.ly - s.ly) * 0.06) * 0.82; s.ly += s.vly;

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      gl!.uniformMatrix4fv(uModel, false, model(s.rx, s.ry, -1.72));
      gl!.uniform3f(uLight, s.lx, s.ly, 0.9);
      gl!.uniform1f(uDepthScale, 0.16);
      gl!.uniform1f(uAspect, imgAspect);
      gl!.drawElements(gl!.TRIANGLES, idx.length, gl!.UNSIGNED_INT, 0);

      if (host) {
        host.style.setProperty("--rx", s.rx.toFixed(4));
        host.style.setProperty("--ry", s.ry.toFixed(4));
        host.style.setProperty("--lx", s.lx.toFixed(4));
        host.style.setProperty("--ly", s.ly.toFixed(4));
      }
      const moving = Math.abs(s.vrx) + Math.abs(s.vry) + Math.abs(s.vlx) + Math.abs(s.vly) > 1e-5 ||
        Math.abs(target.rx - s.rx) + Math.abs(target.ry - s.ry) > 1e-4;
      if (moving && visible && !disposed) raf = requestAnimationFrame(frame);
      else running = false;
    }

    Promise.all([loadImage(src), loadImage(depthSrc)]).then(([img, dep]) => {
      if (disposed) return;
      imgAspect = img.naturalWidth / img.naturalHeight;
      tex(img, 0); tex(dep, 1);
      gl.uniform2f(uTexel, 1.5 / dep.naturalWidth, 1.5 / dep.naturalHeight);
      resize();
      setReady(true);
    }).catch(() => setFallback(true));

    const ro = new ResizeObserver(resize); ro.observe(box);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); });
    io.observe(box);
    window.addEventListener("pointermove", onMove, { passive: true });
    cv.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [src, depthSrc, hostRef]);

  return (
    <div ref={wrap} className={`statue ${ready ? "is-ready" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={fallback ? alt : ""} aria-hidden={!fallback} className="statue-poster" />
      {!fallback && <canvas ref={canvas} role="img" aria-label={alt} />}
    </div>
  );
}
