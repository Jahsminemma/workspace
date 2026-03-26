import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function saveUploadedResume(file: File) {
  const dir = path.join(process.cwd(), 'data', 'uploads');
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, file.name);
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));
  return filePath;
}

export async function extractTextFromUploadedResume(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt' || ext === '.md') {
    return readFile(filePath, 'utf8');
  }

  if (ext === '.pdf') {
    const buffer = await readFile(filePath);
    const parsed = await pdfParse(buffer);
    return parsed.text || '';
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }

  if (ext === '.doc') {
    return readFile(filePath, 'utf8').catch(() => '');
  }

  return readFile(filePath, 'utf8').catch(() => '');
}
