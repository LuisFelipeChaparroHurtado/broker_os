import {
  Component, ChangeDetectionStrategy, input, output, computed
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly page       = input.required<number>();   // 0-indexed
  readonly totalPages = input.required<number>();
  readonly siblings   = input<number>(1);           // páginas a cada lado

  readonly pageChange = output<number>();

  readonly pages = computed<(number | '...')[]>(() => {
    const total = this.totalPages();
    const cur   = this.page();
    const sib   = this.siblings();

    if (total <= 7) return Array.from({ length: total }, (_, i) => i);

    const left  = Math.max(1, cur - sib);
    const right = Math.min(total - 2, cur + sib);
    const pages: (number | '...')[] = [0];

    if (left > 1) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 2) pages.push('...');
    pages.push(total - 1);

    return pages;
  });

  goTo(p: number | '...'): void {
    if (p === '...' || p === this.page()) return;
    this.pageChange.emit(p as number);
  }

  prev(): void { if (this.page() > 0) this.pageChange.emit(this.page() - 1); }
  next(): void { if (this.page() < this.totalPages() - 1) this.pageChange.emit(this.page() + 1); }
}
