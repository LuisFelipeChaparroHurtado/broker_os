import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  readonly isDarkTheme = this.themeService.isDark;

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
