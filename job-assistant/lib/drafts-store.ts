import { readJsonFile, writeJsonFile } from './store';
import type { ApplicationDraft } from './types';

export async function listDrafts() {
  return readJsonFile<ApplicationDraft[]>('drafts.json', []);
}

export async function saveDraft(draft: ApplicationDraft) {
  const drafts = await listDrafts();
  const next = [draft, ...drafts.filter((item) => item.draftId !== draft.draftId)];
  await writeJsonFile('drafts.json', next);
  return draft;
}

export async function updateDraftStatus(draftId: string, reviewStatus: ApplicationDraft['reviewStatus']) {
  const drafts = await listDrafts();
  const existing = drafts.find((item) => item.draftId === draftId);
  if (!existing) return null;
  const updated = { ...existing, reviewStatus };
  await saveDraft(updated);
  return updated;
}
