import { NextRequest, NextResponse } from 'next/server';
import { listDrafts, saveDraft } from '@/lib/drafts-store';

export async function PATCH(request: NextRequest, { params }: { params: { draftId: string } }) {
  const body = await request.json();
  const drafts = await listDrafts();
  const draft = drafts.find((item) => item.draftId === params.draftId);

  if (!draft) {
    return NextResponse.json({ ok: false, error: 'Draft not found' }, { status: 404 });
  }

  const updated = {
    ...draft,
    reviewStatus: body.reviewStatus ?? draft.reviewStatus,
    tailoredSummary: body.tailoredSummary ?? draft.tailoredSummary,
    suggestedAnswers: body.suggestedAnswers ?? draft.suggestedAnswers
  };

  await saveDraft(updated);
  return NextResponse.json({ ok: true, draft: updated });
}
