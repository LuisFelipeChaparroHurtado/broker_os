import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

export interface AccordionItem {
  title: string;
  content: string;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [],
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  readonly items    = input<AccordionItem[]>([]);
  readonly multiple = input<boolean>(false);

  readonly openItems = signal<Set<number>>(new Set());

  isOpen(index: number): boolean {
    return this.openItems().has(index);
  }

  toggle(index: number): void {
    const current = new Set(this.openItems());

    if (current.has(index)) {
      current.delete(index);
    } else {
      if (!this.multiple()) {
        current.clear();
      }
      current.add(index);
    }

    this.openItems.set(current);
  }
}
