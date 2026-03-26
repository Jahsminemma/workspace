import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { chromium, type Locator, type Page } from 'playwright';
import { isGreenhouseUrl, isLeverUrl, extractFirstAnswer } from '../lib/greenhouse';

interface WorkerRun {
  draftId: string;
  queuedAt: string;
  status: 'QUEUED' | 'RUNNING' | 'WAITING' | 'DONE' | 'FAILED';
  message?: string;
  screenshotPath?: string;
  updatedAt?: string;
  unresolvedFields?: string[];
  fieldAnswers?: Record<string, string>;
}

interface Draft {
  draftId: string;
  jobId: string;
  applicationUrl?: string;
  company?: string;
  title?: string;
  resumeArtifactPath?: string;
  resumeHtmlPath?: string;
  resumePdfPath?: string;
  suggestedAnswers?: Array<{ question: string; answer: string }>;
}

interface Profile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumePath?: string;
}

async function readJson<T>(name: string, fallback: T): Promise<T> {
  const file = path.join(process.cwd(), 'data', name);
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(name: string, value: unknown) {
  const dir = path.join(process.cwd(), 'data');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, name);
  await writeFile(file, JSON.stringify(value, null, 2));
}

async function appendLog(line: string) {
  const logs = await readJson<string[]>('worker-log.json', []);
  logs.unshift(`${new Date().toISOString()} ${line}`);
  await writeJson('worker-log.json', logs);
}

function normalize(text?: string | null) {
  return (text ?? '').trim().toLowerCase();
}

function pickProfileValue(key: string, profile: Profile, answer: string) {
  if (key.includes('first')) return profile.firstName ?? '';
  if (key.includes('last')) return profile.lastName ?? '';
  if (key.includes('full name') || key === 'name') return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
  if (key.includes('email')) return profile.email ?? '';
  if (key.includes('phone') || key.includes('mobile')) return profile.phone ?? '';
  if (key.includes('location') || key.includes('city')) return profile.location ?? '';
  if (key.includes('linkedin')) return profile.linkedinUrl ?? '';
  if (key.includes('github')) return profile.githubUrl ?? '';
  if (key.includes('website') || key.includes('portfolio')) return profile.portfolioUrl || profile.githubUrl || '';
  if (key.includes('why') || key.includes('cover') || key.includes('question') || key.includes('additional')) return answer;
  return '';
}

async function labelTextFor(page: Page, input: Locator) {
  const id = await input.getAttribute('id');
  if (id) {
    const label = page.locator(`label[for="${id}"]`).first();
    if (await label.count()) {
      return normalize(await label.textContent());
    }
  }

  const parentLabel = input.locator('xpath=ancestor::label[1]').first();
  if (await parentLabel.count()) {
    return normalize(await parentLabel.textContent());
  }

  return '';
}

async function uploadResumeIfPresent(page: Page, profile: Profile, draft: Draft) {
  const chosenResumePath = draft.resumePdfPath || draft.resumeArtifactPath || profile.resumePath;
  if (!chosenResumePath) {
    await appendLog('No resume artifact or resumePath configured; skipping upload');
    return false;
  }

  const selectors = [
    'input[type="file"]',
    'input[name*="resume" i]',
    'input[id*="resume" i]',
    'input[name*="attachment" i]'
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      await locator.setInputFiles(chosenResumePath).catch(() => undefined);
      await appendLog(`Attempted resume upload with selector: ${selector}`);
      return true;
    }
  }

  await appendLog('No resume upload input found');
  return false;
}

async function autofillFields(page: Page, draft: Draft, profile: Profile, fieldAnswers: Record<string, string> = {}) {
  const answer = extractFirstAnswer(draft);
  const unresolved = new Set<string>();
  const textInputs = page.locator('input[type="text"], input[type="email"], input[type="tel"], input:not([type]), textarea');
  const total = await textInputs.count();

  for (let i = 0; i < total; i++) {
    const input = textInputs.nth(i);
    const currentValue = await input.inputValue().catch(() => '');
    if (currentValue) continue;

    const name = normalize(await input.getAttribute('name'));
    const aria = normalize(await input.getAttribute('aria-label'));
    const placeholder = normalize(await input.getAttribute('placeholder'));
    const id = normalize(await input.getAttribute('id'));
    const label = await labelTextFor(page, input);
    const key = `${name} ${aria} ${placeholder} ${id} ${label}`.trim();

    const userAnswer = fieldAnswers[key];
    const value = userAnswer || pickProfileValue(key, profile, answer);

    if (value) {
      await input.fill(value).catch(() => undefined);
      await appendLog(`Filled field for key: ${key}`);
    } else if (key) {
      unresolved.add(key);
      await appendLog(`Unresolved field: ${key}`);
    }
  }

  return Array.from(unresolved);
}

async function runPortalAutofill(kind: 'greenhouse' | 'lever', draft: Draft, profile: Profile, fieldAnswers: Record<string, string> = {}) {
  if (!draft.applicationUrl) throw new Error('Missing applicationUrl');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await appendLog(`Opening ${draft.applicationUrl}`);
  await page.goto(draft.applicationUrl, { waitUntil: 'domcontentloaded' });

  if (kind === 'greenhouse') {
    const applyButton = page.getByRole('link', { name: /apply/i }).or(page.getByRole('button', { name: /apply/i }));
    if (await applyButton.count()) {
      await applyButton.first().click().catch(() => undefined);
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
    }
  }

  if (kind === 'lever') {
    const applyButton = page.getByRole('button', { name: /apply/i }).or(page.getByRole('link', { name: /apply/i }));
    if (await applyButton.count()) {
      await applyButton.first().click().catch(() => undefined);
      await page.waitForLoadState('domcontentloaded').catch(() => undefined);
    }
  }

  await uploadResumeIfPresent(page, profile, draft);
  const unresolvedFields = await autofillFields(page, draft, profile, fieldAnswers);

  const screenshotPath = path.join(process.cwd(), 'data', `${kind}-${draft.draftId}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
  await appendLog(`Finished ${kind} attempt for ${draft.draftId}`);
  await browser.close();
  return { screenshotPath, unresolvedFields };
}

async function main() {
  await appendLog('Worker started');
  const runs = await readJson<WorkerRun[]>('worker-runs.json', []);
  const drafts = await readJson<Draft[]>('drafts.json', []);
  const profile = await readJson<Profile>('profile.json', {});
  const queued = runs.find((item) => item.status === 'QUEUED');

  if (!queued) {
    await appendLog('No queued runs found');
    console.log('No queued runs found.');
    return;
  }

  const draft = drafts.find((item) => item.draftId === queued.draftId);
  if (!draft) {
    queued.status = 'FAILED';
    queued.message = 'Draft not found';
    queued.updatedAt = new Date().toISOString();
    await writeJson('worker-runs.json', runs);
    throw new Error(`Draft ${queued.draftId} not found`);
  }

  queued.status = 'RUNNING';
  queued.message = 'Launching Playwright';
  queued.updatedAt = new Date().toISOString();
  await writeJson('worker-runs.json', runs);

  try {
    let result;
    let kind: 'greenhouse' | 'lever';

    if (isGreenhouseUrl(draft.applicationUrl)) {
      kind = 'greenhouse';
      result = await runPortalAutofill(kind, draft, profile, queued.fieldAnswers ?? {});
    } else if (isLeverUrl(draft.applicationUrl)) {
      kind = 'lever';
      result = await runPortalAutofill(kind, draft, profile, queued.fieldAnswers ?? {});
    } else {
      throw new Error('Only Greenhouse and Lever URLs are supported right now');
    }

    queued.screenshotPath = result.screenshotPath;
    queued.updatedAt = new Date().toISOString();

    if (result.unresolvedFields.length) {
      queued.status = 'WAITING';
      queued.message = `User review needed for unresolved ${kind} fields`;
      queued.unresolvedFields = result.unresolvedFields;
    } else {
      queued.status = 'DONE';
      queued.message = `${kind} autofill completed`;
      queued.unresolvedFields = [];
    }
  } catch (error) {
    queued.status = 'FAILED';
    queued.message = error instanceof Error ? error.message : 'Unknown worker error';
    queued.updatedAt = new Date().toISOString();
    await appendLog(queued.message);
    throw error;
  } finally {
    await writeJson('worker-runs.json', runs);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
