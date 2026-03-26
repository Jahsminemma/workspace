'use client';

import { useEffect, useState } from 'react';

export function WorkerLogViewer() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/worker/logs')
      .then((res) => res.json())
      .then((data) => setLogs(data.items ?? []))
      .catch(() => setLogs([]));
  }, []);

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Worker Logs</h2>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-emerald-400 whitespace-pre-wrap">
        {logs.length ? logs.join('\n') : 'No logs yet.'}
      </pre>
    </section>
  );
}
