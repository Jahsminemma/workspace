import { NextRequest, NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/profile-store';
import { parseResumeText } from '@/lib/resume-import';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const profile = await getProfile();
  const parsed = parseResumeText(body.text ?? '');

  const updated = {
    ...profile,
    experiences: parsed.experiences,
    projects: parsed.projects
  };

  await saveProfile(updated);
  return NextResponse.json({ ok: true, profile: updated, parsed });
}
