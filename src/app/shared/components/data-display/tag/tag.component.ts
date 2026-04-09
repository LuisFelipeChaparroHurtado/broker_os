import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

export type TagVariant = 'default' | 'mint' | 'violet' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-tag',
  standalone: true,
  templateUrl: './tag.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly variant   = input<TagVariant>('default');
  readonly size      = input<'md' | 'lg'>('md');
  readonly removable = input<boolean>(false);
  readonly dot       = input<boolean>(false);

  readonly removed = output<void>();

  readonly classes = computed(() => ({
    'ds-tag': true,
    [`ds-tag--${this.variant()}`]: true,
    'ds-tag--lg':       this.size() === 'lg',
    'ds-tag--removable': this.removable(),
    'ds-tag--dot':      this.dot(),
  }));
}
