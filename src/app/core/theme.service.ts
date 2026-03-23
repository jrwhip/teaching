import { DOCUMENT } from '@angular/common';
import { computed, effect, inject, Injectable, signal } from '@angular/core';

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
  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView!;

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
      this.doc.documentElement.setAttribute('data-theme', t);
      this.win.localStorage.setItem('theme', t);
    });

    // Apply accent background + derived surface tokens
    effect(() => {
      const accent = this.effectiveAccent();
      const el = this.doc.documentElement;
      if (accent) {
        el.style.setProperty('--bg-accent', accent);
        el.style.setProperty('--bg-surface', `color-mix(in srgb, ${accent} 60%, white)`);
        el.style.setProperty('--bg-muted', `color-mix(in srgb, ${accent} 75%, white)`);
      } else {
        el.style.removeProperty('--bg-accent');
        el.style.removeProperty('--bg-surface');
        el.style.removeProperty('--bg-muted');
      }
    });

    // Persist accent selection (even in dark mode, so it restores on light switch)
    effect(() => {
      const raw = this.accentBg();
      if (raw) {
        this.win.localStorage.setItem('accentBg', raw);
      } else {
        this.win.localStorage.removeItem('accentBg');
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
    const stored = this.win.localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return this.win.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getInitialAccent(): string {
    return this.win.localStorage.getItem('accentBg') ?? '';
  }
}
