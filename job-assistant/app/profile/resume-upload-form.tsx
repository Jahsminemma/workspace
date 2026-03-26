'use client';

import { useState } from 'react';
import { ImportPreviewEditor } from './import-preview-editor';

export function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<any | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setMessage('Choose a resume file first.');
      return;
    }

    setMessage('Uploading and extracting...');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/profile/import/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPreview(data.parsed ?? null);
      setMessage(`Uploaded. Extracted ${data.extractedTextLength ?? 0} characters. Review before saving.`);
    } else {
      setMessage(data.error ?? 'Upload failed.');
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Upload resume file</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input type="file" accept=".txt,.md,.pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="flex items-center gap-3">
          <button type="submit">Upload and extract</button>
          <small className="text-slate-600">{message}</small>
        </div>
      </form>
      <ImportPreviewEditor initialPreview={preview} />
    </section>
  );
}
