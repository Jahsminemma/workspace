'use client';

import { useState } from 'react';

const initial = {
  company: '',
  title: '',
  url: '',
  descriptionText: ''
};

export function JobForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Creating job...');
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    });
    setStatus(res.ok ? 'Job added and draft generated.' : 'Failed to create job.');
    if (res.ok) setForm(initial);
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <input value={form.company} placeholder="Company" onChange={(e) => setForm({ ...form, company: e.target.value })} required />
      <input value={form.title} placeholder="Job title" onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      <input value={form.url} placeholder="Application URL" onChange={(e) => setForm({ ...form, url: e.target.value })} required />
      <textarea value={form.descriptionText} placeholder="Paste job description" rows={8} onChange={(e) => setForm({ ...form, descriptionText: e.target.value })} />
      <div className="flex items-center gap-3">
        <button type="submit">Add job</button>
        <small className="text-slate-600">{status}</small>
      </div>
    </form>
  );
}
