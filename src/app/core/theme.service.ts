import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

export interface AccentColor {
  label: string;
  value: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { label: 'None',          value: '' },
  { label: 'Sky Blue',      value: '#87ceeb' },
  { label: 'Light Green',   value: '#90ee90' },
  { label: 'Lavender',      value: '#e6e6fa' },
  { label: 'Peach',         value: '#ffdab9' },
  { label: 'Light Pink',    value: '#ffb6c1' },
  { label: 'Light Yellow',  value: '#ffffe0' },
  { label: 'Thistle',       value: '#d8bfd8' },
  { label: 'Powder Blue',   value: '#b0e0e6' },
  { label: 'Honeydew',      value: '#f0fff0' },
  { label: 'Misty Rose',    value: '#ffe4e1' },
  { label: 'Alice Blue',    value: '#f0f8ff' },
  { label: 'Lemon Chiffon', value: '#fffacd' },
  { label: 'Cornsilk',      value: '#fff8dc' },
  { label: 'Seashell',      value: '#fff5ee' },
  { label: 'Mint Cream',    value: '#f5fffa' },
  { label: 'Snow',          value: '#fffafa' },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.getInitialTheme());
  readonly accentBg = signal<string>(this.getInitialAccent());

  /** Resolved accent: empty string when dark mode (pastels look bad on dark) */
  readonly effectiveAccent = computed(() =>
    this.theme() === 'dark' ? '' : this.accentBg()
  );

  constructor() {
    // Apply theme attribute
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem('theme', t);
    });

    // Apply accent background CSS variable
    effect(() => {
      const accent = this.effectiveAccent();
      const el = document.documentElement;
      if (accent) {
        el.style.setProperty('--bg-accent', accent);
      } else {
        el.style.removeProperty('--bg-accent');
      }
    });

    // Persist accent selection (even in dark mode, so it restores on light switch)
    effect(() => {
      const raw = this.accentBg();
      if (raw) {
        localStorage.setItem('accentBg', raw);
      } else {
        localStorage.removeItem('accentBg');
      }
    });
  }

  toggle(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setAccent(color: string): void {
    this.accentBg.set(color);
  }

  private getInitialTheme(): Theme {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getInitialAccent(): string {
    return localStorage.getItem('accentBg') ?? '';
  }
}
