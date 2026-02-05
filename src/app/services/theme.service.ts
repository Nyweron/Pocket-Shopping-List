import { Injectable, effect, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export type ThemeName = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme';

  // domyślnie light, nadpiszemy przy inicjalizacji
  private readonly _theme = signal<ThemeName>('light');

  readonly theme = this._theme.asReadonly();

  constructor(private localStorage: LocalStorageService) {
    // Synchronizuj każdą zmianę theme z dokumentem
    effect(() => {
      const current = this._theme();
      this.applyThemeToDocument(current);
    });
  }

  initTheme(): void {
    // 1. Spróbuj odczytać z localStorage
    const stored = this.localStorage.getItem<ThemeName>(this.STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      this._theme.set(stored);
      return;
    }

    // 2. W przeciwnym razie spróbuj użyć preferencji systemowej
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._theme.set(prefersDark ? 'dark' : 'light');
    } else {
      this._theme.set('light');
    }
  }

  setTheme(theme: ThemeName): void {
    this._theme.set(theme);
    this.localStorage.setItem(this.STORAGE_KEY, theme);
  }

  toggleTheme(): void {
    const next: ThemeName = this._theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  private applyThemeToDocument(theme: ThemeName): void {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }
}

