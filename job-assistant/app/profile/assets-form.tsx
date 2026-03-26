'use client';

import { useMemo, useState } from 'react';

const sampleExperience = { company: '', role: '', period: '', bullets: [''] };
const sampleProject = { name: '', description: '', tech: [''], highlights: [''] };

function moveItem<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function AssetsForm({ initialProfile }: { initialProfile: any }) {
  const baseProfile = useMemo(() => initialProfile, [initialProfile]);
  const [experiences, setExperiences] = useState(initialProfile.experiences ?? []);
  const [projects, setProjects] = useState(initialProfile.projects ?? []);
  const [message, setMessage] = useState('');

  async function save() {
    setMessage('Saving assets...');
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...baseProfile, experiences, projects })
    });
    setMessage(res.ok ? 'Assets saved.' : 'Failed to save assets.');
  }

  return (
    <section className="mt-6 grid gap-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold">Experience</h2>
        {experiences.map((item: any, index: number) => (
          <div key={index} className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => index > 0 && setExperiences(moveItem(experiences, index, index - 1))}>↑ Move up</button>
              <button type="button" onClick={() => index < experiences.length - 1 && setExperiences(moveItem(experiences, index, index + 1))}>↓ Move down</button>
              <button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => setExperiences(experiences.filter((_: any, i: number) => i !== index))}>Remove</button>
            </div>
            <input value={item.company} placeholder="Company" onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, company: e.target.value } : x))} />
            <input value={item.role} placeholder="Role" onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, role: e.target.value } : x))} />
            <input value={item.period ?? ''} placeholder="Period" onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, period: e.target.value } : x))} />
            <textarea rows={5} value={(item.bullets ?? []).join('\n')} placeholder="One bullet per line" onChange={(e) => setExperiences(experiences.map((x: any, i: number) => i === index ? { ...x, bullets: e.target.value.split('\n').map((v) => v.trim()).filter(Boolean) } : x))} />
          </div>
        ))}
        <button type="button" className="mt-3" onClick={() => setExperiences([...experiences, { ...sampleExperience }])}>Add experience</button>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Projects</h2>
        {projects.map((item: any, index: number) => (
          <div key={index} className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => index > 0 && setProjects(moveItem(projects, index, index - 1))}>↑ Move up</button>
              <button type="button" onClick={() => index < projects.length - 1 && setProjects(moveItem(projects, index, index + 1))}>↓ Move down</button>
              <button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => setProjects(projects.filter((_: any, i: number) => i !== index))}>Remove</button>
            </div>
            <input value={item.name} placeholder="Project name" onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, name: e.target.value } : x))} />
            <textarea rows={3} value={item.description} placeholder="Project description" onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, description: e.target.value } : x))} />
            <input value={(item.tech ?? []).join(', ')} placeholder="Tech stack" onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, tech: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) } : x))} />
            <textarea rows={4} value={(item.highlights ?? []).join('\n')} placeholder="Project highlights, one per line" onChange={(e) => setProjects(projects.map((x: any, i: number) => i === index ? { ...x, highlights: e.target.value.split('\n').map((v) => v.trim()).filter(Boolean) } : x))} />
          </div>
        ))}
        <button type="button" className="mt-3" onClick={() => setProjects([...projects, { ...sampleProject }])}>Add project</button>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save}>Save experience and projects</button>
        <small className="text-slate-600">{message}</small>
      </div>
    </section>
  );
}
