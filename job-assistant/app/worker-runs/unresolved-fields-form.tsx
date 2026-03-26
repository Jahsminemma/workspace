'use client';

import { useState } from 'react';

export function UnresolvedFieldsForm({ draftId, fields }: { draftId: string; fields: string[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('Saving answers...');
    const res = await fetch('/api/worker/answer-fields', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ draftId, fieldAnswers: answers })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? data.message ?? 'Saved.' : data.error ?? 'Failed.');
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      {fields.map((field) => (
        <label key={field} className="grid gap-1 text-sm">
          <span className="font-medium">{field}</span>
          <input value={answers[field] ?? ''} onChange={(e) => setAnswers({ ...answers, [field]: e.target.value })} placeholder="Enter answer" />
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button type="submit">Save answers and resume</button>
        <small className="text-slate-600">{message}</small>
      </div>
    </form>
  );
}
