import { readJsonFile, writeJsonFile } from './store';
import type { CandidateProfile } from './types';

const defaultProfile: CandidateProfile = {
  userId: 'local-user',
  profileId: 'default',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  resumePath: '',
  headline: '',
  summary: '',
  preferredRoles: [],
  preferredLocations: [],
  remotePreference: 'remote',
  experiences: [],
  projects: []
};

export async function getProfile() {
  return readJsonFile<CandidateProfile>('profile.json', defaultProfile);
}

export async function saveProfile(profile: CandidateProfile) {
  return writeJsonFile('profile.json', profile);
}
