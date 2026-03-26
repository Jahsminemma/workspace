export function isLeverUrl(url?: string) {
  return typeof url === 'string' && /lever\.co/i.test(url);
}
