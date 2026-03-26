import { NextRequest, NextResponse } from 'next/server';
import { parseResumeText } from '@/lib/resume-import';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = parseResumeText(body.text ?? '');
  return NextResponse.json({ ok: true, parsed });
}
