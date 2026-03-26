import type { ExperienceAsset, ProjectAsset } from './types';

const experienceHeadings = ['experience', 'work experience', 'professional experience', 'employment'];
const projectHeadings = ['projects', 'project experience', 'selected projects'];

function isHeading(line: string, headings: string[]) {
  const lower = line.trim().toLowerCase();
  return headings.some((heading) => lower === heading || lower.includes(heading));
}

function extractPeriod(line: string) {
  const match = line.match(/((19|20)\d{2}[^\n]*?(present|current|(19|20)\d{2}))/i);
  return match?.[1]?.trim();
}

function splitRoleCompany(line: string) {
  const parts = line.split(/\s+(?:at|\||—|-)\s+/i).map((item) => item.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { role: parts[0], company: parts[1] };
  }
  return { role: line.trim(), company: 'Unknown Company' };
}

function extractTech(line: string) {
  const techMatch = line.match(/(?:tech|stack|tools)\s*:\s*(.*)$/i);
  if (!techMatch) return [];
  return techMatch[1].split(',').map((item) => item.trim()).filter(Boolean);
}

export function parseResumeText(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.replace(/\t/g, ' ').trim())
    .filter(Boolean);

  const experiences: ExperienceAsset[] = [];
  const projects: ProjectAsset[] = [];

  let mode: 'experience' | 'projects' | null = null;
  let currentExperience: ExperienceAsset | null = null;
  let currentProject: ProjectAsset | null = null;

  for (const line of lines) {
    if (isHeading(line, experienceHeadings)) {
      if (currentExperience) experiences.push(currentExperience);
      if (currentProject) projects.push(currentProject);
      currentExperience = null;
      currentProject = null;
      mode = 'experience';
      continue;
    }

    if (isHeading(line, projectHeadings)) {
      if (currentExperience) experiences.push(currentExperience);
      if (currentProject) projects.push(currentProject);
      currentExperience = null;
      currentProject = null;
      mode = 'projects';
      continue;
    }

    if (mode === 'experience') {
      const period = extractPeriod(line);
      const looksLikeHeader = !line.startsWith('-') && !line.startsWith('•') && (period || / at |\||—| - /i.test(line));

      if (looksLikeHeader) {
        if (currentExperience) experiences.push(currentExperience);
        const cleaned = period ? line.replace(period, '').replace(/\s{2,}/g, ' ').trim() : line;
        const { role, company } = splitRoleCompany(cleaned);
        currentExperience = { company, role, period, bullets: [] };
      } else if (currentExperience) {
        currentExperience.bullets.push(line.replace(/^[-•]\s*/, ''));
      }
      continue;
    }

    if (mode === 'projects') {
      const looksLikeProjectHeader = !line.startsWith('-') && !line.startsWith('•');
      if (looksLikeProjectHeader) {
        if (currentProject) projects.push(currentProject);
        currentProject = {
          name: line,
          description: '',
          tech: [],
          highlights: []
        };
      } else if (currentProject) {
        const cleaned = line.replace(/^[-•]\s*/, '');
        const extractedTech = extractTech(cleaned);
        if (extractedTech.length) {
          currentProject.tech = Array.from(new Set([...(currentProject.tech ?? []), ...extractedTech]));
        } else if (!currentProject.description) {
          currentProject.description = cleaned;
        } else {
          currentProject.highlights?.push(cleaned);
        }
      }
    }
  }

  if (currentExperience) experiences.push(currentExperience);
  if (currentProject) projects.push(currentProject);

  return { experiences, projects };
}
