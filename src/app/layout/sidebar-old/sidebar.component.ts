import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

export interface NavSubItem {
  label: string;
  key: string;
}

export interface NavItem {
  label: string;
  key: string;
  children?: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly brandName = input('Broker OS');
  readonly brandTag = input('Design System');
  readonly sections = input<NavSection[]>([]);
  readonly activeKey = input('');

  readonly navigate = output<string>();
  readonly themeToggle = output<void>();

  // Track collapsed sections and groups
  readonly collapsedSections = signal<Set<number>>(new Set());
  readonly collapsedGroups = signal<Set<string>>(new Set<string>());
  readonly mobileOpen = signal(false);
  readonly isDark = signal(true);

  toggleSection(index: number): void {
    this.collapsedSections.update(s => {
      const next = new Set(s);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }

  isSectionCollapsed(index: number): boolean {
    return this.collapsedSections().has(index);
  }

  toggleGroup(key: string): void {
    this.collapsedGroups.update(s => {
      const next = new Set(s);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  isGroupCollapsed(key: string): boolean {
    return this.collapsedGroups().has(key);
  }

  onNavigate(key: string): void {
    this.navigate.emit(key);
  }

  onItemClick(item: NavItem): void {
    if (item.children?.length) {
      this.toggleGroup(item.key);
    }
    this.navigate.emit(item.key);
  }

  onThemeToggle(): void {
    this.isDark.update(v => !v);
    this.themeToggle.emit();
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }
}
