import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readJsonFile<T>(name: string, fallback: T): Promise<T> {
  await ensureDir();
  const file = path.join(dataDir, name);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(name: string, value: T): Promise<T> {
  await ensureDir();
  const file = path.join(dataDir, name);
  await fs.writeFile(file, JSON.stringify(value, null, 2));
  return value;
}
