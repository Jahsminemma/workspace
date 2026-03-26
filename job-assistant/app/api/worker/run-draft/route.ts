import { NextRequest, NextResponse } from 'next/server';
import { listDrafts } from '@/lib/drafts-store';
import { queueWorkerRun } from '@/lib/worker-store';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const drafts = await listDrafts();
  const draft = drafts.find((item) => item.draftId === body.draftId);

  if (!draft) {
    return NextResponse.json({ ok: false, error: 'Draft not found' }, { status: 404 });
  }

  if (draft.reviewStatus !== 'APPROVED') {
    return NextResponse.json({ ok: false, error: 'Draft must be approved first' }, { status: 400 });
  }

  await queueWorkerRun({ draftId: draft.draftId, queuedAt: new Date().toISOString(), status: 'QUEUED' });
  return NextResponse.json({ ok: true, message: 'Draft queued for local worker' });
}
