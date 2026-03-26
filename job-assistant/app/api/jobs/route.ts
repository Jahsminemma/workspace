import { NextRequest, NextResponse } from 'next/server';
import { createJob, listJobs } from '@/lib/jobs-store';
import { generateDraft } from '@/lib/tailor';
import { saveDraft } from '@/lib/drafts-store';

export async function GET() {
  const items = await listJobs();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const job = await createJob(body);
    const draft = await generateDraft(job);
    await saveDraft(draft);
    return NextResponse.json({ ok: true, job, draft });
  } catch (error) {
    console.error('Failed to create job draft', error);
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Unknown error creating job' }, { status: 500 });
  }
}
