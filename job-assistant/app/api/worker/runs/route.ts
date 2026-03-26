import { NextResponse } from 'next/server';
import { listWorkerRuns } from '@/lib/worker-store';

export async function GET() {
  const items = await listWorkerRuns();
  return NextResponse.json({ items });
}
