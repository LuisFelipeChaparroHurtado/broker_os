import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, NavSection } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  readonly activeKey = signal('demo');
  readonly brandName = 'Broker OS';
  readonly brandTag = 'Design System';

  readonly sections: NavSection[] = [
    {
      label: 'Principal',
      items: [
        { label: 'Terminal', key: 'terminal' },
        { label: 'Portfolio', key: 'portfolio' },
        { label: 'Órdenes', key: 'orders' },
      ],
    },
    {
      label: 'Herramientas',
      items: [
        { label: 'Design System', key: 'demo' },
        { label: 'Configuración', key: 'settings' },
      ],
    },
  ];

  onNavigate(key: string): void {
    this.activeKey.set(key);
  }

  onThemeToggle(): void {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  }
}
