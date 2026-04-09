import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed
} from '@angular/core';

export interface AutocompleteItem {
  label: string;
  sub?: string;
}

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [],
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent {
  readonly suggestions = input<AutocompleteItem[]>([]);
  readonly placeholder = input<string>('');
  readonly disabled    = input<boolean>(false);

  readonly selected = output<AutocompleteItem>();
  readonly search   = output<string>();

  readonly query   = signal('');
  readonly open    = signal(false);
  readonly focused = signal(false);

  readonly filtered = computed(() => {
    const q = this.query().toLowerCase();
    if (!q) return this.suggestions();
    return this.suggestions().filter(s =>
      s.label.toLowerCase().includes(q)
    );
  });

  onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.query.set(val);
    this.open.set(true);
    this.search.emit(val);
  }

  onFocus(): void {
    this.focused.set(true);
    this.open.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.open.set(false);
  }

  pick(item: AutocompleteItem): void {
    this.query.set(item.label);
    this.open.set(false);
    this.selected.emit(item);
  }
}
