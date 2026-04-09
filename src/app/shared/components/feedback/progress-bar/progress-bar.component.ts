import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  templateUrl: './progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  readonly value         = input<number>(0);    // 0-100
  readonly label         = input<string>('');
  readonly showPercent   = input<boolean>(true);
  readonly size          = input<'sm' | 'md' | 'lg'>('md');
  readonly indeterminate = input<boolean>(false);

  readonly trackClasses = computed(() => ({
    'ds-progress-track': true,
    'ds-progress-track--sm': this.size() === 'sm',
    'ds-progress-track--lg': this.size() === 'lg',
    'ds-progress-indeterminate': this.indeterminate(),
  }));

  readonly clampedValue = computed(() =>
    Math.min(100, Math.max(0, this.value()))
  );
}
