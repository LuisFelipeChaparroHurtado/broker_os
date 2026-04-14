import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

const SECTION_ROUTES: Readonly<Record<string, string>> = {
  'dashboard': '/app/dashboard',
  'perfil':    '/app/perfil',
};

type MenuKey = 'transacciones' | 'trading' | 'productos' | 'referidos';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly openMenu = signal<MenuKey | null>('transacciones');
  readonly activeSection = signal<string>('dashboard');

  readonly brand = {
    name: 'Broker OS',
    tag: 'Portal Cliente',
  };

  isMenuOpen(key: MenuKey): boolean {
    return this.openMenu() === key && !this.collapsed();
  }

  isActive(section: string): boolean {
    return this.activeSection() === section;
  }

  isParentActive(_menu: MenuKey, children: readonly string[]): boolean {
    return children.includes(this.activeSection());
  }

  toggleMobile(): void { this.mobileOpen.update(v => !v); }
  closeMobile(): void { this.mobileOpen.set(false); }

  toggleMenu(key: MenuKey): void {
    if (this.collapsed()) {
      this.collapsed.set(false);
      this.openMenu.set(key);
      return;
    }
    this.openMenu.update(curr => (curr === key ? null : key));
  }

  selectSection(section: string, parent?: MenuKey): void {
    this.activeSection.set(section);
    if (parent) this.openMenu.set(parent);
    this.mobileOpen.set(false);
    const route = SECTION_ROUTES[section];
    if (route) this.router.navigateByUrl(route).catch(() => {});
  }

  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
    if (this.collapsed()) this.openMenu.set(null);
  }

  readonly transaccionesChildren = ['depositar', 'retiros', 'transferencias', 'historial-tx'] as const;
  readonly tradingChildren = ['crear-cuenta', 'mis-cuentas', 'webtrader', 'tradingview', 'social-trader', 'copy-trading'] as const;
  readonly productosChildren = ['leverage-12x', 'prop-firm', 'bin-plus', 'pamm-account', 'ecn-account'] as const;
  readonly referidosChildren = ['resumen-ib', 'mi-comunidad', 'centro-puntos'] as const;
}
