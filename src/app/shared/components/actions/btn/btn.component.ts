import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'mint' | 'gradient';
export type BtnSize    = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-btn',
  standalone: true,
  templateUrl: './btn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnComponent {
  readonly variant  = input<BtnVariant>('primary');
  readonly size     = input<BtnSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading  = input<boolean>(false);
  readonly icon     = input<string>('');          // leading icon (text/emoji)
  readonly iconOnly = input<boolean>(false);
  readonly round    = input<boolean>(false);       // circular icon button
  readonly full     = input<boolean>(false);       // width 100%
  readonly type     = input<'button' | 'submit' | 'reset'>('button');

  readonly btnClick = output<MouseEvent>();

  get classes(): Record<string, boolean> {
    return {
      'ds-btn': true,
      [`ds-btn--${this.variant()}`]: true,
      'ds-btn--sm': this.size() === 'sm',
      'ds-btn--lg': this.size() === 'lg',
      'ds-btn--icon': this.iconOnly(),
      'ds-btn--icon.ds-btn--sm': this.iconOnly() && this.size() === 'sm',
      'ds-btn--icon-round': this.round(),
      'ds-btn--full': this.full(),
      'ds-btn--loading': this.loading(),
      'ds-btn--disabled': this.disabled(),
    };
  }

  onClick(e: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit(e);
    }
  }
}
