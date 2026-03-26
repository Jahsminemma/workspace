'use client';

import { useState } from 'react';

export function ResumeRunButton({ draftId, status }: { draftId: string; status: string }) {
  const [message, setMessage] = useState('');

  async function resume() {
    setMessage('Re-queuing...');
    const res = await fetch('/api/worker/resume', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ draftId })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? data.message ?? 'Run resumed.' : data.error ?? 'Failed to resume run.');
  }

  if (status !== 'WAITING') return null;

  return (
    <div className="mt-2 flex items-center gap-3">
      <button type="button" onClick={resume}>Resume run</button>
      <small className="text-slate-600">{message}</small>
    </div>
  );
}
