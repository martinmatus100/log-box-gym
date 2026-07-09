import { StateStorage } from 'zustand/middleware';

const storageKey = 'logboxgym_store';
const backupKey = 'logboxgym_backup';
const MAX_BACKUPS = 3;

function createBackup(): void {
  try {
    const current = localStorage.getItem(storageKey);
    if (!current) return;
    const parsed = JSON.parse(current);
    const hasData = (parsed?.state?.routines?.length > 0) || (parsed?.state?.dayWorkouts?.length > 0);
    if (!hasData) return;

    const existing: { data: string; timestamp: number }[] = JSON.parse(localStorage.getItem(backupKey) || '[]');
    const lastBackup = existing.length > 0 ? existing[existing.length - 1] : null;
    if (lastBackup && lastBackup.data === current) return;

    const newBackup = { data: current, timestamp: Date.now() };
    existing.push(newBackup);
    const recent = existing.slice(-MAX_BACKUPS);
    localStorage.setItem(backupKey, JSON.stringify(recent));
  } catch {}
}

export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name || storageKey);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    const key = name || storageKey;
    createBackup();
    localStorage.setItem(key, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name || storageKey);
  },
};

export function getStoredBackup(): string | null {
  try {
    const backups: { data: string; timestamp: number }[] = JSON.parse(localStorage.getItem(backupKey) || '[]');
    if (backups.length === 0) return null;
    return backups[backups.length - 1].data;
  } catch {
    return null;
  }
}

export function restoreFromBackup(): boolean {
  try {
    const backup = getStoredBackup();
    if (!backup) return false;
    localStorage.setItem(storageKey, backup);
    return true;
  } catch {
    return false;
  }
}

export function getBackupInfo(): { timestamp: number; routines: number; workouts: number }[] {
  try {
    const backups: { data: string; timestamp: number }[] = JSON.parse(localStorage.getItem(backupKey) || '[]');
    return backups.map(b => {
      try {
        const parsed = JSON.parse(b.data);
        const state = parsed?.state || {};
        return {
          timestamp: b.timestamp,
          routines: state.routines?.length || 0,
          workouts: state.dayWorkouts?.length || 0,
        };
      } catch {
        return { timestamp: b.timestamp, routines: 0, workouts: 0 };
      }
    });
  } catch {
    return [];
  }
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function playBeep(frequency: number = 800, duration: number = 100): void {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  } catch {
    // Audio not available
  }
}