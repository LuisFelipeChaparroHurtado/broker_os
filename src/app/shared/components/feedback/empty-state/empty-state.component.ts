import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon        = input<string>('📭');
  readonly title       = input<string>('Sin datos');
  readonly message     = input<string>('');
  readonly actionLabel = input<string>('');

  readonly action = output<void>();
}
