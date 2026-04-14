import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HelpAction, TopbarComponent, TopbarLang } from '../topbar/topbar.component';
import { AuthSessionService } from '../../core/services/auth/auth-session.service';
import { AuthStore } from '../../store/auth/auth.store';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router       = inject(Router);
  private readonly authSession  = inject(AuthSessionService);
  private readonly authStore    = inject(AuthStore);

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
  /**
   * Cierra sesión:
   *   1. `DELETE /api/v1/auth/session` — invalida el access_token en Redis
   *      del backend y hace que el refresh_token pierda su pair
   *   2. `finalize` limpia el estado local (signals + localStorage) y
   *      redirige a /auth/login, SIEMPRE — incluso si la API falla por
   *      red/timeout, para no dejar al usuario atrapado con una sesión
   *      "muerta" localmente.
   *   3. Errores del API se silencian en el subscribe (el usuario ya se
   *      está yendo, no tiene sentido toastearlos).
   */
  onLogoutClick(): void {
    this.authSession
      .logout()
      .pipe(finalize(() => this.authStore.logoutAndRedirect()))
      .subscribe({ error: () => {} });
  }
}
