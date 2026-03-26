import { NextRequest, NextResponse } from 'next/server';
import { getProfile, saveProfile } from '@/lib/profile-store';

export async function GET() {
  const profile = await getProfile();
  return NextResponse.json(profile);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const saved = await saveProfile(body);
  return NextResponse.json({ ok: true, profile: saved });
}
