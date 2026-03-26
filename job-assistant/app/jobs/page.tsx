import { listJobs } from '@/lib/jobs-store';
import { JobForm } from './job-form';

export default async function JobsPage() {
  const items = await listJobs();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
      <p className="mt-2 text-slate-600">Add a job manually for now. Creating one also generates a draft.</p>
      <div className="mt-6">
        <JobForm />
      </div>
      <div className="grid gap-4">
        {items.map((job) => (
          <article key={job.jobId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{job.title} — {job.company}</h3>
            <div className="mt-2 text-sm text-slate-600">Status: {job.status}</div>
            <a className="mt-2 block text-sm text-blue-600 hover:underline" href={job.url} target="_blank">{job.url}</a>
            {job.descriptionText ? (
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
                {job.descriptionText.slice(0, 300)}{job.descriptionText.length > 300 ? '…' : ''}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </main>
  );
}
