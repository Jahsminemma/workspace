import { NextRequest, NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/profile-store';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const profile = await getProfile();
  const mode = body.mode === 'replace' ? 'replace' : 'append';

  const updated = {
    ...profile,
    experiences: mode === 'replace' ? (body.experiences ?? []) : [
      ...(profile.experiences ?? []),
      ...(body.experiences ?? [])
    ],
    projects: mode === 'replace' ? (body.projects ?? []) : [
      ...(profile.projects ?? []),
      ...(body.projects ?? [])
    ]
  };

  await saveProfile(updated);
  return NextResponse.json({ ok: true, profile: updated, mode });
}
