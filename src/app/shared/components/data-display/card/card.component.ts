import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly label      = input<string>('');
  readonly value      = input<string>('');
  readonly change     = input<string>('');
  readonly changeType = input<'pos' | 'neg' | 'mint' | ''>('');
}
