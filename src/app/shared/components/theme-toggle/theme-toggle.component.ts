import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STORAGE_KEY = 'broker-os-theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent implements OnInit {
  private readonly document = inject(DOCUMENT);

  readonly isDarkTheme = signal(true);

  ngOnInit(): void {
    const saved = localStorage.getItem(STORAGE_KEY);
    const isDark = saved !== 'light';
    this.isDarkTheme.set(isDark);
    this.document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const isDark = !this.isDarkTheme();
    this.isDarkTheme.set(isDark);
    const theme = isDark ? 'dark' : 'light';
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }
}
