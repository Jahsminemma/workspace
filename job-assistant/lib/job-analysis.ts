export interface JobSignals {
  keywords: string[];
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'unknown';
  remote: boolean;
}

const keywordBank = [
  'typescript',
  'javascript',
  'react',
  'next.js',
  'node',
  'aws',
  'serverless',
  'dynamodb',
  'postgres',
  'playwright',
  'python',
  'graphql',
  'docker',
  'kubernetes',
  'api',
  'backend',
  'frontend',
  'full-stack'
];

export function analyzeJobText(text: string): JobSignals {
  const lower = text.toLowerCase();
  const keywords = keywordBank.filter((keyword) => lower.includes(keyword));

  let seniority: JobSignals['seniority'] = 'unknown';
  if (/(lead|staff|principal)/i.test(text)) seniority = 'lead';
  else if (/senior/i.test(text)) seniority = 'senior';
  else if (/(mid|intermediate)/i.test(text)) seniority = 'mid';
  else if (/(junior|entry)/i.test(text)) seniority = 'junior';

  return {
    keywords,
    seniority,
    remote: /remote/i.test(text)
  };
}
