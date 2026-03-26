import { readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { chromium } from 'playwright';
import { renderResumeHtml } from '../lib/resume-render';

async function main() {
  const dir = path.join(process.cwd(), 'data', 'resumes');
  const files = await readdir(dir).catch(() => []);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const file of markdownFiles) {
    const markdownPath = path.join(dir, file);
    const htmlPath = await renderResumeHtml(markdownPath);
    await page.goto(`file://${htmlPath}`);
    const pdfPath = markdownPath.replace(/\.md$/i, '.pdf');
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

    const draftId = file.replace(/\.md$/i, '');
    const draftsPath = path.join(process.cwd(), 'data', 'drafts.json');
    const drafts = JSON.parse(await readFile(draftsPath, 'utf8'));
    const updated = drafts.map((draft: any) => draft.draftId === draftId ? { ...draft, resumeHtmlPath: htmlPath, resumePdfPath: pdfPath } : draft);
    await writeFile(draftsPath, JSON.stringify(updated, null, 2));
    console.log(`Rendered ${file}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
