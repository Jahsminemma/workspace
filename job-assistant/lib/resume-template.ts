import type { CandidateProfile, JobPosting } from './types';
import { analyzeJobText } from './job-analysis';

export function buildStructuredResume(profile: CandidateProfile, job: JobPosting) {
  const signals = analyzeJobText(job.descriptionText || `${job.title} ${job.company}`);

  const experienceLines = profile.experiences?.flatMap((exp) => [
    `${exp.role} — ${exp.company}${exp.period ? ` (${exp.period})` : ''}`,
    ...(exp.bullets || []).map((bullet) => `  • ${bullet}`)
  ]) ?? [
    'Built and shipped production software features with practical business impact.',
    'Worked across APIs, backend services, frontend interfaces, and delivery workflows.',
    'Comfortable owning implementation details and improving product reliability.'
  ];

  const projectLines = profile.projects?.flatMap((project) => [
    `${project.name}: ${project.description}`,
    ...(project.highlights || []).map((item) => `  • ${item}`),
    ...(project.tech?.length ? [`  • Tech: ${project.tech.join(', ')}`] : [])
  ]) ?? [];

  const profileSkills = [
    ...(signals.keywords.length ? signals.keywords : []),
    ...((profile.projects ?? []).flatMap((project) => project.tech ?? []))
  ];

  return {
    name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
    headline: profile.headline || 'Software Engineer',
    contact: [profile.email, profile.phone, profile.location].filter(Boolean),
    links: [profile.linkedinUrl, profile.githubUrl, profile.portfolioUrl].filter(Boolean),
    summary: profile.summary || 'Product-minded software engineer focused on building reliable, practical systems.',
    targetRole: `${job.title} at ${job.company}`,
    keywords: signals.keywords,
    sections: {
      highlights: [
        `Aligned with ${job.title} responsibilities and product-focused engineering work.`,
        `Relevant overlap: ${signals.keywords.join(', ') || 'software engineering, backend systems, delivery'}.`,
        `Preference fit: ${profile.remotePreference || 'remote'} work style.`
      ],
      experience: experienceLines,
      projects: projectLines,
      skills: Array.from(new Set(profileSkills)).length ? Array.from(new Set(profileSkills)) : ['JavaScript', 'TypeScript', 'APIs', 'Backend', 'Frontend'],
      notes: [
        'This resume was tailored automatically for the target role.',
        'Review before submission to refine company-specific language.'
      ]
    }
  };
}
