import { NextResponse } from 'next/server';
import { saveUploadedResume, extractTextFromUploadedResume } from '@/lib/file-import';
import { parseResumeText } from '@/lib/resume-import';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 });
  }

  const filePath = await saveUploadedResume(file);
  const text = await extractTextFromUploadedResume(filePath);
  const parsed = parseResumeText(text);

  return NextResponse.json({ ok: true, filePath, parsed, extractedTextLength: text.length });
}
