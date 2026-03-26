export function isGreenhouseUrl(url?: string) {
  return typeof url === 'string' && /greenhouse\.io/i.test(url);
}

export function isLeverUrl(url?: string) {
  return typeof url === 'string' && /lever\.co/i.test(url);
}

export function extractFirstAnswer(draft: { suggestedAnswers?: Array<{ question: string; answer: string }> }) {
  return draft.suggestedAnswers?.[0]?.answer ?? '';
}
