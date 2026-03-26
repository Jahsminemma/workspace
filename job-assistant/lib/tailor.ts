import type { ApplicationDraft, JobPosting } from './types';
import { getProfile } from './profile-store';
import { createTailoredDraft } from './tailor-engine';
import { generateResumeArtifact } from './resume-artifacts';
import { renderResumeHtml } from './resume-render';
import { chromium } from 'playwright';

export async function generateDraft(job: JobPosting): Promise<ApplicationDraft> {
  const profile = await getProfile();
  const draft = createTailoredDraft(profile, job);
  draft.resumeArtifactPath = await generateResumeArtifact(profile, job, draft.draftId);
  draft.resumeHtmlPath = await renderResumeHtml(draft.resumeArtifactPath);

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`file://${draft.resumeHtmlPath}`);
    draft.resumePdfPath = draft.resumeArtifactPath.replace(/\.md$/i, '.pdf');
    await page.pdf({ path: draft.resumePdfPath, format: 'A4', printBackground: true });
    await browser.close();
  } catch (error) {
    console.error('PDF render failed; continuing without PDF artifact', error);
    draft.resumePdfPath = undefined;
  }

  return draft;
}
