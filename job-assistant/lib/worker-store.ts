import { readJsonFile, writeJsonFile } from './store';

export interface WorkerRun {
  draftId: string;
  queuedAt: string;
  status: 'QUEUED' | 'RUNNING' | 'WAITING' | 'DONE' | 'FAILED';
  message?: string;
  screenshotPath?: string;
  updatedAt?: string;
  unresolvedFields?: string[];
  fieldAnswers?: Record<string, string>;
}

export async function listWorkerRuns() {
  return readJsonFile<WorkerRun[]>('worker-runs.json', []);
}

export async function queueWorkerRun(run: WorkerRun) {
  const runs = await listWorkerRuns();
  const next = [run, ...runs];
  await writeJsonFile('worker-runs.json', next);
  return run;
}
