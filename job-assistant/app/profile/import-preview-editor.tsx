'use client';

import { useState } from 'react';

export function ImportPreviewEditor({ initialPreview }: { initialPreview: any }) {
  const [experiences, setExperiences] = useState(initialPreview?.experiences ?? []);
  const [projects, setProjects] = useState(initialPreview?.projects ?? []);
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState<'replace' | 'append'>('append');

  async function saveReviewed() {
    setMessage('Saving reviewed import...');
    const res = await fetch('/api/profile/import/reviewed', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ experiences, projects, mode })
    });
    setMessage(res.ok ? 'Reviewed import saved.' : 'Failed to save reviewed import.');
  }

  if (!initialPreview) return null;

  return (
    <div className="mt-4 grid gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold">Review parsed import</h3>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Save mode</label>
        <select value={mode} onChange={(e) => setMode(e.target.value as 'replace' | 'append')}>
          <option value="append">Append to existing assets</option>
          <option value="replace">Replace existing assets</option>
        </select>
      </div>

      <div>
        <strong className="text-sm">Experiences</strong>
        {experiences.map((item: any, index: number) => (
          <div key={index} className="mt-3 grid gap-2 rounded-lg border border-slate-200 p-3">
            <button type="button" className="w-fit bg-red-600 hover:bg-red-500" onClick={() => setExperiences(experiences.filter((_: any, i: number) => i !== index))}>Remove</button>
            <input value={item.company ?? ''} onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, company: e.target.value } : x))} placeholder="Company" />
            <input value={item.role ?? ''} onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, role: e.target.value } : x))} placeholder="Role" />
            <input value={item.period ?? ''} onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, period: e.target.value } : x))} placeholder="Period" />
            <textarea rows={4} value={(item.bullets ?? []).join('\n')} onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, bullets: e.target.value.split('\n').map((v) => v.trim()).filter(Boolean) } : x))} placeholder="Bullets" />
          </div>
        ))}
      </div>

      <div>
        <strong className="text-sm">Projects</strong>
        {projects.map((item: any, index: number) => (
          <div key={index} className="mt-3 grid gap-2 rounded-lg border border-slate-200 p-3">
            <button type="button" className="w-fit bg-red-600 hover:bg-red-500" onClick={() => setProjects(projects.filter((_: any, i: number) => i !== index))}>Remove</button>
            <input value={item.name ?? ''} onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, name: e.target.value } : x))} placeholder="Project name" />
            <textarea rows={3} value={item.description ?? ''} onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, description: e.target.value } : x))} placeholder="Description" />
            <input value={(item.tech ?? []).join(', ')} onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, tech: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) } : x))} placeholder="Tech" />
            <textarea rows={4} value={(item.highlights ?? []).join('\n')} onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, highlights: e.target.value.split('\n').map((v) => v.trim()).filter(Boolean) } : x))} placeholder="Highlights" />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={saveReviewed}>Save reviewed import</button>
        <small className="text-slate-600">{message}</small>
      </div>
    </div>
  );
}
