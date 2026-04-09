import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed
} from '@angular/core';

import { TableConfig, SortState, PageEvent, RowAction } from './data-table.models';
import { PaginationComponent } from '../../navigation/pagination/pagination.component';
import { EmptyStateComponent } from '../../feedback/empty-state/empty-state.component';
import { SkeletonComponent } from '../../feedback/skeleton/skeleton.component';
import { MenuComponent, MenuItem } from '../../actions/menu/menu.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    PaginationComponent, EmptyStateComponent, SkeletonComponent, MenuComponent,
  ],
  templateUrl: './data-table.component.html',
  styleUrl:    './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends Record<string, any>> {
  readonly config     = input.required<TableConfig<T>>();
  readonly data       = input.required<T[]>();
  readonly loading    = input<boolean>(false);
  readonly totalItems = input<number>(0);
  readonly pageSize   = input<number>(25);
  readonly title      = input<string>('');

  readonly rowAction    = output<{ action: string; row: T }>();
  readonly pageChange   = output<PageEvent>();
  readonly sortChange   = output<SortState>();

  readonly currentPage = signal(0);
  readonly sortState   = signal<SortState | null>(null);

  readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()) || 1
  );

  readonly isEmpty = computed(() =>
    !this.loading() && this.data().length === 0
  );

  onSort(key: string): void {
    const cur = this.sortState();
    const next: SortState = cur?.column === key && cur.direction === 'asc'
      ? { column: key, direction: 'desc' }
      : { column: key, direction: 'asc' };
    this.sortState.set(next);
    this.sortChange.emit(next);
  }

  onPage(page: number): void {
    this.currentPage.set(page);
    this.pageChange.emit({ page, size: this.pageSize() });
  }

  onRowAction(action: string, row: T): void {
    this.rowAction.emit({ action, row });
  }

  rowMenuItems(actions: RowAction[]): MenuItem[] {
    return actions.map(a => ({
      label:  a.label,
      icon:   a.icon,
      action: a.action,
      danger: a.danger,
    }));
  }

  sortClass(key: string): string {
    const s = this.sortState();
    if (s?.column !== key) return '';
    return s.direction === 'asc' ? 'sort-asc' : 'sort-desc';
  }

  cellClass(type: string | undefined): string {
    switch (type) {
      case 'mono':         return 'ds-td-mono';
      case 'positive':     return 'ds-td-positive';
      case 'negative':     return 'ds-td-negative';
      case 'mint':         return 'ds-td-mint';
      case 'badge-buy':    return '';
      case 'badge-sell':   return '';
      case 'badge-pending':return '';
      case 'badge-active': return '';
      default:             return '';
    }
  }

  trackByFn(_: number, row: T): unknown {
    return row[this.config().trackBy];
  }
}
