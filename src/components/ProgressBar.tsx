export function ProgressBar({ index, total }: { index: number; total: number }) {
  const pct = ((index + 1) / total) * 100;
  return (
    <div className="fixed inset-x-0 top-0 z-40 h-1.5 bg-glass" role="progressbar" aria-label="Progression" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
      <div className="h-full bg-gradient-to-r from-enig via-lime to-cyan transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}
