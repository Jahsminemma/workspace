import { randomUUID } from 'crypto';
import { readJsonFile, writeJsonFile } from './store';
import type { JobPosting } from './types';

export async function listJobs() {
  return readJsonFile<JobPosting[]>('jobs.json', []);
}

export async function createJob(input: Omit<JobPosting, 'jobId' | 'status'> & { status?: JobPosting['status'] }) {
  const jobs = await listJobs();
  const item: JobPosting = {
    jobId: randomUUID(),
    status: input.status ?? 'DISCOVERED',
    ...input
  };
  jobs.unshift(item);
  await writeJsonFile('jobs.json', jobs);
  return item;
}
