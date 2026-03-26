import { NextRequest, NextResponse } from 'next/server';
import { listWorkerRuns, queueWorkerRun } from '@/lib/worker-store';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const runs = await listWorkerRuns();
  const target = runs.find((item) => item.draftId === body.draftId && item.status === 'WAITING');

  if (!target) {
    return NextResponse.json({ ok: false, error: 'No waiting run found for draft' }, { status: 404 });
  }

  await queueWorkerRun({
    ...target,
    status: 'QUEUED',
    message: 'User supplied unresolved field answers',
    updatedAt: new Date().toISOString(),
    fieldAnswers: body.fieldAnswers ?? {},
    unresolvedFields: []
  });

  return NextResponse.json({ ok: true, message: 'Answers saved and run re-queued' });
}
