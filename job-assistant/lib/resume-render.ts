import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function markdownToSections(markdown: string) {
  const lines = markdown.split('\n');
  const sections: Array<{ title: string; items: string[] }> = [];
  let name = '';
  let subtitle = '';
  let contact = '';
  let links = '';
  let current: { title: string; items: string[] } | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('# ')) {
      name = line.slice(2);
      continue;
    }
    if (!subtitle) {
      subtitle = line;
      continue;
    }
    if (!contact) {
      contact = line;
      continue;
    }
    if (!links) {
      links = line;
      continue;
    }
    if (line.startsWith('## ')) {
      current = { title: line.slice(3), items: [] };
      sections.push(current);
      continue;
    }
    if (current) {
      current.items.push(line.replace(/^-\s*/, ''));
    }
  }

  return { name, subtitle, contact, links, sections };
}

export async function renderResumeHtml(markdownPath: string) {
  const markdown = await readFile(markdownPath, 'utf8');
  const parsed = markdownToSections(markdown);

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Tailored Resume</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 850px; margin: 32px auto; line-height: 1.45; color: #111; font-size: 14px; }
      h1 { margin: 0; font-size: 28px; }
      h2 { margin: 20px 0 8px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
      .subtitle { margin-top: 6px; font-size: 16px; font-weight: 600; }
      .meta { margin-top: 8px; color: #333; }
      ul { margin: 8px 0 0 18px; padding: 0; }
      li { margin: 4px 0; }
      .page { padding: 8px 4px 24px; }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>${escapeHtml(parsed.name)}</h1>
      <div class="subtitle">${escapeHtml(parsed.subtitle)}</div>
      <div class="meta">${escapeHtml(parsed.contact)}</div>
      <div class="meta">${escapeHtml(parsed.links)}</div>
      ${parsed.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`).join('')}
    </div>
  </body>
</html>`;

  const dir = path.dirname(markdownPath);
  await mkdir(dir, { recursive: true });
  const htmlPath = markdownPath.replace(/\.md$/i, '.html');
  await writeFile(htmlPath, html, 'utf8');
  return htmlPath;
}
