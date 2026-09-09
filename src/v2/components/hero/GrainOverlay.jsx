// Shared texture layer over both the canvas and the text stack, so backdrop
// and copy read as one composited frame rather than two independent layers.
// Ported unchanged from the old Hero.jsx.
export default function GrainOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[20] opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: '160px 160px',
      }}
      aria-hidden="true"
    />
  );
}
