import {
  Component, ChangeDetectionStrategy, input, output, signal, OnInit
} from '@angular/core';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [],
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements OnInit {
  readonly tabs      = input<{ label: string; badge?: string; key: string }[]>([]);
  readonly activeTab = input<string>('');
  readonly variant   = input<'line' | 'pill'>('line');

  readonly tabChange = output<string>();

  readonly active = signal<string>('');

  ngOnInit(): void {
    const initial = this.activeTab();
    const tabList = this.tabs();
    this.active.set(initial || (tabList.length ? tabList[0].key : ''));
  }

  select(key: string): void {
    this.active.set(key);
    this.tabChange.emit(key);
  }
}
