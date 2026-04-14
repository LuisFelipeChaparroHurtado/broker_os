import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HelpAction, TopbarComponent, TopbarLang } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);

  private readonly navEnd = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)),
    { initialValue: null },
  );

  readonly currentSection = computed(() => {
    this.navEnd();
    const url = this.router.url;
    const segment = url.split('/').filter(Boolean).pop() ?? 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  });

  onLangChange(lang: TopbarLang): void { console.log('lang:', lang); }
  onNotificationsClick(): void { console.log('notifications'); }
  onSupportClick(): void { console.log('support'); }
  onAvatarClick(): void { console.log('avatar'); }
  onHelpItemClick(action: HelpAction): void { console.log('help item:', action); }
  onProfileClick(): void { this.router.navigateByUrl('/app/perfil').catch(() => {}); }
  onSettingsClick(): void { console.log('settings'); }
  onLogoutClick(): void { this.router.navigateByUrl('/auth/login').catch(() => {}); }
}
