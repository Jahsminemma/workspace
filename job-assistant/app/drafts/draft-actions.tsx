'use client';

import { useState } from 'react';

export function DraftActions({ draftId, initialStatus }: { draftId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');

  async function update(nextStatus: 'APPROVED' | 'REJECTED') {
    setMessage('Updating...');
    const res = await fetch(`/api/drafts/${draftId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ reviewStatus: nextStatus })
    });
    if (res.ok) {
      setStatus(nextStatus);
      setMessage(`Draft ${nextStatus.toLowerCase()}.`);
    } else {
      setMessage('Failed to update draft.');
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <strong className="text-sm">Status: {status}</strong>
      <button type="button" onClick={() => update('APPROVED')}>Approve</button>
      <button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => update('REJECTED')}>Reject</button>
      <small className="text-slate-600">{message}</small>
    </div>
  );
}
