import { listDrafts } from '@/lib/drafts-store';
import { DraftActions } from './draft-actions';
import { EditDraftForm } from './edit-draft-form';
import { RunWorkerButton } from './run-worker-button';

export default async function DraftsPage() {
  const items = await listDrafts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Drafts</h1>
      <p className="mt-2 text-slate-600">Review, edit, approve, and trigger local autofill for drafts.</p>
      <div className="mt-6 grid gap-4">
        {items.map((draft) => (
          <article key={draft.draftId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{draft.draftId}</h3>
            <div className="mt-2 text-sm text-slate-600">Fit score: {draft.fitScore}</div>
            {draft.tailoredSummary ? <p className="mt-3 text-sm text-slate-700">{draft.tailoredSummary}</p> : null}
            {draft.suggestedAnswers?.length ? (
              <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                {draft.suggestedAnswers.map((item, index) => (
                  <li key={index}><strong>{item.question}</strong>: {item.answer}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 grid gap-1 text-sm text-slate-600">
              {draft.resumeArtifactPath ? <div><strong>Resume artifact:</strong> {draft.resumeArtifactPath}</div> : null}
              {draft.resumeHtmlPath ? <div><strong>Resume HTML:</strong> {draft.resumeHtmlPath}</div> : null}
              {draft.resumePdfPath ? <div><strong>Resume PDF:</strong> {draft.resumePdfPath}</div> : null}
            </div>
            <div className="mt-4 grid gap-3">
              <EditDraftForm draft={draft} />
              <DraftActions draftId={draft.draftId} initialStatus={draft.reviewStatus} />
              <RunWorkerButton draftId={draft.draftId} reviewStatus={draft.reviewStatus} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
