import { StateStorage } from 'zustand/middleware';

const storageKey = 'logboxgym_store';

export const zustandStorage: StateStorage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name || storageKey);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name || storageKey, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name || storageKey);
  },
};

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