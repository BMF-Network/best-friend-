import { BMFUser } from '../types/bmf';

export const ADMIN_EMAILS = [
  'concoituze@gmail.com',
  'concorderuhungande@gmail.com',
];

export function normalizeEmail(email: string): string {
  const clean = email.trim().toLowerCase();
  if (clean.includes('.gmail.com') && !clean.includes('@')) {
    return clean.replace('.gmail.com', '@gmail.com');
  }
  if (!clean.includes('@') && (clean === 'concoituze' || clean === 'concorderuhungande')) {
    return `${clean}@gmail.com`;
  }
  return clean;
}

export function isSuperAdminEmail(email: string): boolean {
  const norm = normalizeEmail(email);
  return norm === 'concoituze@gmail.com' || norm === 'concorderuhungande@gmail.com';
}

/**
 * Regal audible chime for Admin broadcasts using Web Audio API
 */
export function playAdminBroadcastChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 royal triad
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.75);
    });
  } catch (e) {
    console.debug('Audio context chime muted or unavailable', e);
  }
}

export function getDefaultUser(): BMFUser | null {
  try {
    const raw = localStorage.getItem('bmf_active_session');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse stored session', e);
  }
  return null;
}

export function saveUserSession(user: BMFUser | null) {
  if (user) {
    localStorage.setItem('bmf_active_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('bmf_active_session');
  }
}
