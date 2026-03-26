import type { CandidateProfile, JobPosting, ApplicationDraft } from './types';
import { analyzeJobText } from './job-analysis';

function sentence(value?: string) {
  return value?.trim() ? value.trim() : '';
}

function topRole(profile: CandidateProfile) {
  return profile.preferredRoles?.[0] || profile.headline || 'software engineer';
}

function buildSummary(profile: CandidateProfile, job: JobPosting) {
  const signals = analyzeJobText(job.descriptionText || `${job.title} ${job.company}`);
  const role = topRole(profile);
  const matchedKeywords = signals.keywords.slice(0, 5);
  const keywordText = matchedKeywords.length ? ` Key overlap: ${matchedKeywords.join(', ')}.` : '';
  const remoteText = signals.remote && profile.remotePreference === 'remote' ? ' This role also matches my remote preference.' : '';

  return `${profile.firstName || 'I'} am targeting ${role} opportunities and would tailor this application for ${job.title} at ${job.company}. ${sentence(profile.summary)}${keywordText}${remoteText}`.trim();
}

function buildInterestAnswer(profile: CandidateProfile, job: JobPosting) {
  const signals = analyzeJobText(job.descriptionText || `${job.title} ${job.company}`);
  const pieces = [
    `I'm interested in ${job.title} at ${job.company} because it lines up with the kind of practical software problems I like solving.`
  ];

  if (signals.keywords.length) {
    pieces.push(`The role's emphasis on ${signals.keywords.slice(0, 4).join(', ')} is especially relevant to my background and the kind of systems I want to keep building.`);
  }

  if (profile.summary) {
    pieces.push(profile.summary);
  }

  return pieces.join(' ');
}

function buildRelevantExperienceAnswer(profile: CandidateProfile, job: JobPosting) {
  const role = topRole(profile);
  const signals = analyzeJobText(job.descriptionText || `${job.title} ${job.company}`);
  const skills = signals.keywords.slice(0, 5).join(', ');
  return `My background is strongest around ${role} work, with emphasis on building reliable product features, APIs, and delivery-focused systems.${skills ? ` Based on this job description, the most relevant overlap looks like ${skills}.` : ''}`;
}

export function createTailoredDraft(profile: CandidateProfile, job: JobPosting): ApplicationDraft {
  return {
    draftId: `draft_${job.jobId}`,
    jobId: job.jobId,
    fitScore: 0.8,
    applicationUrl: job.url,
    company: job.company,
    title: job.title,
    tailoredSummary: buildSummary(profile, job),
    suggestedAnswers: [
      {
        question: 'Why are you interested in this role?',
        answer: buildInterestAnswer(profile, job)
      },
      {
        question: 'What relevant experience do you bring?',
        answer: buildRelevantExperienceAnswer(profile, job)
      }
    ],
    reviewStatus: 'PENDING_REVIEW'
  };
}
