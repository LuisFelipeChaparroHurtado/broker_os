import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type BadgeVariant = 'buy' | 'sell' | 'pending' | 'active';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="classes()"><ng-content></ng-content></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input.required<BadgeVariant>();

  readonly classes = computed(() => ({
    'ds-badge-sm': true,
    [`ds-badge-${this.variant()}`]: true,
  }));
}
