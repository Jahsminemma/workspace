'use client';

import { useState } from 'react';
import { ImportPreviewEditor } from './import-preview-editor';

export function ResumeImportForm() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<any | null>(null);

  async function previewParse() {
    setMessage('Parsing preview...');
    const res = await fetch('/api/profile/import/preview', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPreview(data.parsed ?? null);
      setMessage('Preview ready. Review before saving.');
    } else {
      setMessage('Preview failed.');
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage('Importing...');
    const res = await fetch('/api/profile/import', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json().catch(() => ({}));
    setMessage(res.ok ? `Imported ${data.parsed?.experiences?.length ?? 0} experiences and ${data.parsed?.projects?.length ?? 0} projects.` : 'Import failed.');
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Import resume text</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <textarea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste resume text here. Best results come from plain text with clear Experience and Projects headings." />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={previewParse}>Preview parse</button>
          <button type="submit">Parse into profile assets</button>
        </div>
        <small className="text-slate-600">{message}</small>
      </form>

      <ImportPreviewEditor initialPreview={preview} />
    </section>
  );
}
