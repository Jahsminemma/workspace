'use client';

import { useState } from 'react';

export function ProfileForm({ initialProfile }: { initialProfile: any }) {
  const [form, setForm] = useState(initialProfile);
  const [status, setStatus] = useState('');

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('Saving...');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form)
    });
    setStatus(res.ok ? 'Saved.' : 'Failed to save.');
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <input value={form.firstName ?? ''} placeholder="First name" onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      <input value={form.lastName ?? ''} placeholder="Last name" onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      <input value={form.email ?? ''} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input value={form.phone ?? ''} placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input value={form.location ?? ''} placeholder="Location" onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <input value={form.linkedinUrl ?? ''} placeholder="LinkedIn URL" onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} />
      <input value={form.githubUrl ?? ''} placeholder="GitHub URL" onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
      <input value={form.portfolioUrl ?? ''} placeholder="Portfolio URL" onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} />
      <input value={form.resumePath ?? ''} placeholder="Local resume file path" onChange={(e) => setForm({ ...form, resumePath: e.target.value })} />
      <input value={form.headline ?? ''} placeholder="Headline" onChange={(e) => setForm({ ...form, headline: e.target.value })} />
      <textarea value={form.summary ?? ''} placeholder="Summary" rows={6} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
      <input value={(form.preferredRoles ?? []).join(', ')} placeholder="Preferred roles" onChange={(e) => setForm({ ...form, preferredRoles: e.target.value.split(',').map((v: string) => v.trim()).filter(Boolean) })} />
      <input value={(form.preferredLocations ?? []).join(', ')} placeholder="Preferred locations" onChange={(e) => setForm({ ...form, preferredLocations: e.target.value.split(',').map((v: string) => v.trim()).filter(Boolean) })} />
      <select value={form.remotePreference ?? 'remote'} onChange={(e) => setForm({ ...form, remotePreference: e.target.value })}>
        <option value="remote">Remote</option>
        <option value="hybrid">Hybrid</option>
        <option value="onsite">Onsite</option>
      </select>
      <div className="flex items-center gap-3">
        <button type="submit">Save profile</button>
        <small className="text-slate-600">{status}</small>
      </div>
    </form>
  );
}
