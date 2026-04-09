import {
  Component, ChangeDetectionStrategy, input, output,
  signal, HostListener, ElementRef, inject
} from '@angular/core';

export interface MenuItem {
  label:    string;
  icon?:    string;
  action?:  string;
  danger?:  boolean;
  divider?: boolean;        // si true, renderiza un separador en lugar de item
  disabled?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl:    './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly items       = input.required<MenuItem[]>();
  readonly triggerLabel = input<string>('Opciones');
  readonly triggerIcon  = input<string>('⋯');
  readonly placement    = input<'bottom-left' | 'bottom-right'>('bottom-left');

  readonly menuAction = output<string>();

  readonly open = signal(false);

  private readonly el = inject(ElementRef);

  toggle(): void { this.open.update(v => !v); }

  select(item: MenuItem): void {
    if (item.disabled || item.divider) return;
    if (item.action) this.menuAction.emit(item.action);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.open.set(false);
    }
  }
}
