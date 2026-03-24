const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateInviteCode(length = 6): string {
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, v => CHARS[v % CHARS.length]).join('');
}
