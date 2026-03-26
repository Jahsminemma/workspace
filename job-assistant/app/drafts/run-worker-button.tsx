'use client';

import { useState } from 'react';

export function RunWorkerButton({ draftId, reviewStatus }: { draftId: string; reviewStatus: string }) {
  const [status, setStatus] = useState('');

  async function run() {
    setStatus('Triggering local worker...');
    const res = await fetch('/api/worker/run-draft', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ draftId })
    });
    const data = await res.json().catch(() => ({}));
    setStatus(res.ok ? data.message ?? 'Worker triggered.' : data.error ?? 'Failed to trigger worker.');
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={run} disabled={reviewStatus !== 'APPROVED'}>
        Run local autofill
      </button>
      <small className="text-slate-600">{reviewStatus !== 'APPROVED' ? 'Approve draft first.' : status}</small>
    </div>
  );
}
