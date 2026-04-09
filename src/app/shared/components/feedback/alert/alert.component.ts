import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info' | 'mint';

const ICONS: Record<AlertVariant, string> = {
  success: '✓', error: '✕', warning: '⚠', info: 'ℹ', mint: '◈',
};

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  readonly variant   = input<AlertVariant>('info');
  readonly title     = input<string>('');
  readonly message   = input<string>('');
  readonly closeable = input<boolean>(true);

  readonly closed = output<void>();

  readonly icon = computed(() => ICONS[this.variant()]);

  readonly alertClasses = computed(() => ({
    'ds-alert': true,
    [`ds-alert--${this.variant()}`]: true,
  }));
}
