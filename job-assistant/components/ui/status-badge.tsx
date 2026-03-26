export function StatusBadge({ value }: { value: string }) {
  const tone = value === 'DONE'
    ? 'bg-emerald-100 text-emerald-800'
    : value === 'FAILED'
      ? 'bg-red-100 text-red-800'
      : value === 'WAITING'
        ? 'bg-amber-100 text-amber-800'
        : 'bg-slate-100 text-slate-800';

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>{value}</span>;
}
