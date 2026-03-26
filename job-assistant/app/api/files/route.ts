import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('path');
  if (!file) {
    return NextResponse.json({ ok: false, error: 'Missing path' }, { status: 400 });
  }

  const normalized = path.normalize(file);
  const dataDir = path.join(process.cwd(), 'data');
  if (!normalized.startsWith(dataDir)) {
    return NextResponse.json({ ok: false, error: 'Path outside data directory' }, { status: 403 });
  }

  try {
    const buffer = await readFile(normalized);
    const ext = path.extname(normalized).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'application/octet-stream';
    return new NextResponse(buffer, { headers: { 'content-type': contentType } });
  } catch {
    return NextResponse.json({ ok: false, error: 'File not found' }, { status: 404 });
  }
}
