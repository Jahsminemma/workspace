import { NextResponse } from 'next/server';
import { listDrafts } from '@/lib/drafts-store';

export async function GET() {
  const items = await listDrafts();
  return NextResponse.json({ items });
}
