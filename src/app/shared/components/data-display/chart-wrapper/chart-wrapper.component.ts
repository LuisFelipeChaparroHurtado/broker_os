import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-chart-wrapper',
  standalone: true,
  imports: [],
  templateUrl: './chart-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartWrapperComponent {
  readonly title           = input<string>('');
  readonly subtitle        = input<string>('');
  readonly value           = input<string>('');
  readonly change          = input<string>('');
  readonly timeframes      = input<string[]>(['1D', '1S', '1M', '3M', '1A']);
  readonly activeTimeframe = input<string>('1M');

  readonly timeframeChange = output<string>();

  readonly activeTf = signal<string>('1M');

  selectTf(tf: string): void {
    this.activeTf.set(tf);
    this.timeframeChange.emit(tf);
  }
}
