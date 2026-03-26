import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-worker-token');
  if (!process.env.LOCAL_WORKER_TOKEN || token !== process.env.LOCAL_WORKER_TOKEN) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ ok: true, queued: true, payload: body });
}
