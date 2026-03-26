'use client';

import { useState } from 'react';

export function EditDraftForm({ draft }: { draft: any }) {
  const [summary, setSummary] = useState(draft.tailoredSummary ?? '');
  const [answer, setAnswer] = useState(draft.suggestedAnswers?.[0]?.answer ?? '');
  const [status, setStatus] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Saving...');
    const res = await fetch(`/api/drafts/${draft.draftId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tailoredSummary: summary,
        suggestedAnswers: [
          {
            question: draft.suggestedAnswers?.[0]?.question ?? 'Why are you interested in this role?',
            answer
          }
        ]
      })
    });
    setStatus(res.ok ? 'Draft updated.' : 'Failed to update draft.');
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tailored summary" />
      <textarea rows={5} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Suggested answer" />
      <div className="flex items-center gap-3">
        <button type="submit">Save draft edits</button>
        <small className="text-slate-600">{status}</small>
      </div>
    </form>
  );
}
