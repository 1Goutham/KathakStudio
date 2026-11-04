# Generates public/nataraja-depth.png (R=depth hi, G=AO, B=depth lo) and public/nataraja-normal.webp
# from the cut-out.  Usage: pip install opencv-python-headless numpy && python3 scripts/build_depth.py public/nataraja.webp public
# Structure is modelled explicitly: flame halo (back) -> prabha ring as a torus -> figure with
# multi-scale rounded volume (hair/hands taper into the ring) -> Apasmara -> cylindrical pedestal,
# plus engraving relief from the photo.
import cv2, numpy as np, sys
src = sys.argv[1]; out = sys.argv[2]
im = cv2.imread(src, cv2.IMREAD_UNCHANGED)
H, W = im.shape[:2]
alpha = im[:, :, 3].astype(np.float32) / 255
m = (alpha > 0.5).astype(np.uint8)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
CX, CY = 516.0, 584.0
r = np.hypot(xx - CX, yy - CY)
ss = lambda e0, e1, x: np.clip((x - e0) / (e1 - e0), 0, 1) ** 2 * (3 - 2 * np.clip((x - e0) / (e1 - e0), 0, 1))

bgr = im[:, :, :3].astype(np.float32) / 255
lum = cv2.cvtColor(im[:, :, :3], cv2.COLOR_BGR2GRAY).astype(np.float32) / 255

# --- soft region weights (no hard seams) --------------------------------
base_top = 1088.0
w_inner = 1 - ss(334, 348, r)
w_flame = ss(440, 452, r)
w_ring = np.clip(1 - w_inner - w_flame, 0, 1)
w_dwarf = 1 - ss(0.75, 1.0, np.hypot((xx - 516) / 200, (yy - 1010) / 92))
w_ped = ss(base_top - 30, base_top + 30, yy)

dt = cv2.distanceTransform(m, cv2.DIST_L2, 5)
def round_of(scale):
    u = np.clip(dt / scale, 0, 1)
    return np.sqrt(1 - (1 - u) ** 2)

tube = np.clip(1 - ((r - 392) / 58) ** 2, 0, 1)
d_ring = 0.12 + 0.16 * np.sqrt(tube) + 0.03 * round_of(6)
d_flame = 0.07 + 0.10 * round_of(14)

# figure: multi-scale roundness gives limbs and torso real volume
body = 0.30 * round_of(12) + 0.40 * round_of(32) + 0.30 * round_of(70)
torso = np.exp(-(((xx - 520) / 120) ** 2 + ((yy - 600) / 200) ** 2))
taper = ss(240, 345, r)                      # hair & hands blend back into the ring
d_fig = (0.30 + 0.36 * body + 0.10 * torso) * (1 - taper) + (d_ring + 0.04) * taper

d_dwarf = 0.32 + 0.30 * (0.5 * round_of(14) + 0.5 * round_of(40))

d_ped = np.zeros_like(alpha)
for y in range(int(base_top) - 30, H):
    xs = np.nonzero(m[y])[0]
    if len(xs) < 4: continue
    c = (xs.min() + xs.max()) / 2; hw = max((xs.max() - xs.min()) / 2, 1)
    u = np.clip((np.arange(W) - c) / hw, -1, 1)
    d_ped[y] = 0.20 + 0.34 * np.sqrt(1 - u ** 2)
d_ped += 0.04 * round_of(10)

upper = w_inner * d_fig + w_ring * d_ring + w_flame * d_flame
upper = upper * (1 - w_dwarf) + np.maximum(upper, d_dwarf) * w_dwarf
depth = upper * (1 - w_ped) + d_ped * w_ped

# soften seams between regions, keep silhouette edges bevelled
depth = cv2.GaussianBlur(depth * m, (0, 0), 4.0)
norm = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 4.0) + 1e-4
depth = np.where(m > 0, depth / norm, 0) * (0.6 + 0.4 * round_of(4))

# fine engraving relief from luminance high-pass
hp = lum - cv2.GaussianBlur(lum, (0, 0), 5)
depth = np.clip(depth + 0.015 * hp, 0, 1) * m
depth /= depth.max()

# --- normals (for lighting) ---------------------------------------------
dz = cv2.GaussianBlur(depth, (0, 0), 1.5) * 40.0
nx = -cv2.Sobel(dz, cv2.CV_32F, 1, 0, ksize=3) / 8
ny = -cv2.Sobel(dz, cv2.CV_32F, 0, 1, ksize=3) / 8
# add micro-normals from the photo itself for metal detail
lb = cv2.GaussianBlur(lum, (0, 0), 1.2) * 1.0
nx += -cv2.Sobel(lb, cv2.CV_32F, 1, 0, ksize=3) / 8
ny += -cv2.Sobel(lb, cv2.CV_32F, 0, 1, ksize=3) / 8
nz = np.ones_like(nx)
l = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
nrm = np.dstack([nx / l, -ny / l, nz / l])          # y up
nrm_img = ((nrm * 0.5 + 0.5) * 255).astype(np.uint8)

# --- ambient occlusion (cavities + contact shadows behind the figure) ---
ao = np.zeros_like(depth)
for s, w in ((4, 0.35), (12, 0.4), (30, 0.25)):
    ao += w * np.clip((cv2.GaussianBlur(depth, (0, 0), s) - depth) * 6, 0, 1)
ao = 1 - np.clip(ao, 0, 0.85)

# extend depth past the silhouette so edge triangles stay flat (no smeared skirts)
filled = depth.copy(); known = m.astype(bool)
k3 = np.ones((3, 3), np.uint8)
for _ in range(14):
    dil = cv2.dilate(filled, k3)
    grow = cv2.dilate(known.astype(np.uint8), k3).astype(bool) & ~known
    filled[grow] = dil[grow]; known |= grow
depth = filled

d16 = np.round(depth * 65535).astype(np.uint32)
packed = np.dstack([ (d16 & 255).astype(np.uint8), (ao * 255).astype(np.uint8), (d16 >> 8).astype(np.uint8)])  # BGR order -> R=hi,G=ao,B=lo
cv2.imwrite(f"{out}/nataraja-depth.png", packed, [cv2.IMWRITE_PNG_COMPRESSION, 9])
cv2.imwrite(f"{out}/nataraja-normal.webp", cv2.cvtColor(nrm_img, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_WEBP_QUALITY, 92])
pass  # cv2.imwrite("preview-depth.jpg", cv2.resize((depth * 255).astype(np.uint8), (524, 734)))
pass  # cv2.imwrite("preview-ao.jpg", cv2.resize((ao * 255).astype(np.uint8), (524, 734)))
pass  # cv2.imwrite("preview-normal.jpg", cv2.resize(cv2.cvtColor(nrm_img, cv2.COLOR_RGB2BGR), (524, 734)))
print("ok", depth.min(), depth.max())
