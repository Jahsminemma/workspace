export type JobStatus = 'DISCOVERED' | 'SCORED' | 'DRAFTED' | 'APPROVED' | 'APPLYING' | 'APPLIED' | 'FAILED';

export interface ExperienceAsset {
  company: string;
  role: string;
  period?: string;
  bullets: string[];
}

export interface ProjectAsset {
  name: string;
  description: string;
  tech?: string[];
  highlights?: string[];
}

export interface CandidateProfile {
  userId: string;
  profileId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumePath?: string;
  headline?: string;
  summary?: string;
  preferredRoles?: string[];
  preferredLocations?: string[];
  remotePreference?: 'remote' | 'hybrid' | 'onsite';
  experiences?: ExperienceAsset[];
  projects?: ProjectAsset[];
}

export interface JobPosting {
  jobId: string;
  company: string;
  title: string;
  url: string;
  status: JobStatus;
  descriptionText?: string;
}

export interface ApplicationDraft {
  draftId: string;
  jobId: string;
  fitScore: number;
  applicationUrl?: string;
  company?: string;
  title?: string;
  tailoredSummary?: string;
  suggestedAnswers?: Array<{ question: string; answer: string }>;
  resumeArtifactPath?: string;
  resumeHtmlPath?: string;
  resumePdfPath?: string;
  reviewStatus: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'NEEDS_EDIT';
}
