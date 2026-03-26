import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import type { CandidateProfile, JobPosting } from './types';
import { buildStructuredResume } from './resume-template';

export async function generateResumeArtifact(profile: CandidateProfile, job: JobPosting, draftId: string) {
  const dir = path.join(process.cwd(), 'data', 'resumes');
  await mkdir(dir, { recursive: true });

  const structured = buildStructuredResume(profile, job);
  const lines = [
    `# ${structured.name}`,
    structured.headline,
    '',
    structured.contact.join(' | '),
    structured.links.join(' | '),
    '',
    '## Professional Summary',
    structured.summary,
    '',
    '## Target Role',
    structured.targetRole,
    '',
    '## Core Highlights',
    ...structured.sections.highlights.map((line) => `- ${line}`),
    '',
    '## Experience Highlights',
    ...structured.sections.experience.map((line) => `- ${line}`),
    '',
    '## Projects',
    ...(structured.sections.projects ?? []).map((line) => `- ${line}`),
    '',
    '## Skills',
    structured.sections.skills.join(', '),
    '',
    '## Notes',
    ...structured.sections.notes.map((line) => `- ${line}`)
  ];

  const file = path.join(dir, `${draftId}.md`);
  await writeFile(file, lines.join('\n'), 'utf8');
  return file;
}
