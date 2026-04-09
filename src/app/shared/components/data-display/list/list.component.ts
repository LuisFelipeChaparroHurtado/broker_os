import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

export interface ListItem {
  avatar?: string;
  name: string;
  sub?: string;
  value?: string;
  valueClass?: string;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  readonly items = input<ListItem[]>([]);

  readonly itemClick = output<number>();
}
