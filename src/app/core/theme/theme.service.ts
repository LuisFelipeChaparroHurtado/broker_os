import { Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'broker-os-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _theme = signal<Theme>(this.readInitial());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    this.apply(this._theme());
  }

  toggle(): void {
    this.set(this._theme() === 'dark' ? 'light' : 'dark');
  }

  set(next: Theme): void {
    if (next === this._theme()) return;
    this._theme.set(next);
    this.apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }

  private apply(theme: Theme): void {
    this.document.documentElement.setAttribute('data-theme', theme);
  }

  private readInitial(): Theme {
    const attr = this.document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  }
}
