import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener,
  Input, Output, computed, inject, signal,
} from '@angular/core';
import { ThemeService } from '../../core/theme/theme.service';

export type TopbarLang = 'ES' | 'EN';
export type HelpAction = 'center' | 'support' | 'tutorials' | 'faq';

interface HelpItem {
  key: HelpAction;
  label: string;
  description: string;
  icon: 'book' | 'chat' | 'play' | 'question';
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarComponent {
  @Input() breadcrumb: string[] = ['Broker OS', 'Dashboard'];
  @Input() activeLang: TopbarLang = 'ES';
  @Input() hasNotifications = false;
  @Input() userName = 'CM';
  @Input() userFullName = 'Carlos Martinez';
  @Input() userRole = 'Cuenta Pro · #08423';

  @Output() langChange = new EventEmitter<TopbarLang>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() helpItemClick = new EventEmitter<HelpAction>();
  @Output() supportClick = new EventEmitter<void>();
  @Output() avatarClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() settingsClick = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();
  @Output() menuClick = new EventEmitter<void>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly themeService = inject(ThemeService);

  readonly theme = this.themeService.theme;
  readonly themeTooltip = computed(() =>
    this.theme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro',
  );

  readonly helpOpen = signal(false);
  readonly userOpen = signal(false);

  readonly helpItems: readonly HelpItem[] = [
    { key: 'center',    label: 'Centro de ayuda',   description: 'Documentación y guías', icon: 'book' },
    { key: 'support',   label: 'Contactar soporte', description: 'Chat con un agente',    icon: 'chat' },
    { key: 'tutorials', label: 'Tutoriales',        description: 'Videos y recorridos',   icon: 'play' },
    { key: 'faq',       label: 'Preguntas frecuentes', description: 'Respuestas rápidas', icon: 'question' },
  ];

  get crumbs(): string[] { return this.breadcrumb.slice(0, -1); }
  get current(): string { return this.breadcrumb[this.breadcrumb.length - 1] ?? ''; }

  setLang(lang: TopbarLang): void {
    if (this.activeLang !== lang) this.langChange.emit(lang);
  }

  toggleHelp(event: MouseEvent): void {
    event.stopPropagation();
    this.userOpen.set(false);
    this.helpOpen.update(v => !v);
  }

  selectHelpItem(action: HelpAction): void {
    this.helpOpen.set(false);
    this.helpItemClick.emit(action);
    if (action === 'support') this.supportClick.emit();
  }

  toggleUser(event: MouseEvent): void {
    event.stopPropagation();
    this.helpOpen.set(false);
    this.userOpen.update(v => !v);
    this.avatarClick.emit();
  }

  onProfile(): void { this.userOpen.set(false); this.profileClick.emit(); }
  onSettings(): void { this.userOpen.set(false); this.settingsClick.emit(); }
  onLogout(): void { this.userOpen.set(false); this.logoutClick.emit(); }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.helpOpen() && !this.userOpen()) return;
    const target = event.target as Node;
    if (!this.host.nativeElement.contains(target)) {
      this.helpOpen.set(false);
      this.userOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.helpOpen.set(false);
    this.userOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
