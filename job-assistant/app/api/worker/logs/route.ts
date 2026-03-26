import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/store';

export async function GET() {
  const items = await readJsonFile<string[]>('worker-log.json', []);
  return NextResponse.json({ items });
}
