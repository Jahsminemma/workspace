export function ScreenshotPreview({ path }: { path: string }) {
  const src = `/api/files?path=${encodeURIComponent(path)}`;
  return (
    <div className="mt-3">
      <div className="mb-2 text-sm font-medium text-slate-700">Screenshot preview</div>
      <img src={src} alt="Worker screenshot" className="max-h-[480px] w-full rounded-lg border border-slate-200 object-contain" />
    </div>
  );
}
