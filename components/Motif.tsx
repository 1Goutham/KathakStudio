// Decorative mandala / ghungroo-inspired SVG ornaments (original artwork).
export function Mandala({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="96" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="78" strokeWidth="0.6" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="22" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="8" strokeWidth="0.8" />
      {petals.map((_, i) => (
        <g key={i} transform={`rotate(${(360 / petals.length) * i} 100 100)`}>
          <path d="M100 24 C 112 50, 112 64, 100 78 C 88 64, 88 50, 100 24 Z" strokeWidth="0.7" />
          <circle cx="100" cy="14" r="2.2" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
      <span />
    </div>
  );
}
