import { listWorkerRuns } from '@/lib/worker-store';
import { ResumeRunButton } from './resume-run-button';
import { WorkerLogViewer } from './worker-log-viewer';
import { UnresolvedFieldsForm } from './unresolved-fields-form';
import { ScreenshotPreview } from './screenshot-preview';
import { Card, CardText, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { SectionHeader } from '@/components/ui/section-header';

export default async function WorkerRunsPage() {
  const items = await listWorkerRuns();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <SectionHeader title="Worker Runs" subtitle="Queue and execution history for the local automation worker." />
      <div className="mt-6 grid gap-4">
        {items.map((run, index) => (
          <Card key={`${run.draftId}-${index}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>{run.draftId}</CardTitle>
              <StatusBadge value={run.status} />
            </div>
            <div className="mt-3 grid gap-1 text-sm text-slate-700">
              <div><strong>Queued:</strong> {run.queuedAt}</div>
              {run.updatedAt ? <div><strong>Updated:</strong> {run.updatedAt}</div> : null}
              {run.message ? <div><strong>Message:</strong> {run.message}</div> : null}
              {run.screenshotPath ? <div><strong>Screenshot:</strong> {run.screenshotPath}</div> : null}
            </div>
            {run.screenshotPath ? <ScreenshotPreview path={run.screenshotPath} /> : null}
            {run.unresolvedFields?.length ? (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
                <strong>Unresolved fields:</strong>
                <ul className="mt-2 list-disc pl-5">
                  {run.unresolvedFields.map((field, fieldIndex) => <li key={fieldIndex}>{field}</li>)}
                </ul>
                <div className="mt-3">
                  <UnresolvedFieldsForm draftId={run.draftId} fields={run.unresolvedFields} />
                </div>
              </div>
            ) : null}
            <div className="mt-3">
              <ResumeRunButton draftId={run.draftId} status={run.status} />
            </div>
          </Card>
        ))}
        {!items.length ? <CardText>No worker runs yet.</CardText> : null}
      </div>
      <WorkerLogViewer />
    </main>
  );
}
