import {
  Component, ChangeDetectionStrategy, input, output,
  signal, forwardRef, HostListener, ElementRef, inject
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface MultiSelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [],
  templateUrl: './multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true,
  }],
})
export class MultiSelectComponent implements ControlValueAccessor {
  readonly options     = input<MultiSelectOption[]>([]);
  readonly placeholder = input<string>('Seleccionar...');
  readonly disabled    = input<boolean>(false);

  readonly valueChange = output<(string | number)[]>();

  readonly selected = signal<(string | number)[]>([]);
  readonly open     = signal(false);
  readonly focused  = signal(false);

  private readonly el = inject(ElementRef);

  private onChange: (v: (string | number)[]) => void = () => {};
  private onTouched: () => void = () => {};

  toggleOpen(): void {
    if (this.disabled()) return;
    this.open.update(v => !v);
    this.focused.set(this.open());
  }

  toggleOption(val: string | number): void {
    const current = this.selected();
    const next = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val];
    this.selected.set(next);
    this.onChange(next);
    this.onTouched();
    this.valueChange.emit(next);
  }

  remove(val: string | number, event: MouseEvent): void {
    event.stopPropagation();
    const next = this.selected().filter(v => v !== val);
    this.selected.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  labelFor(val: string | number): string {
    const opt = this.options().find(o => o.value === val);
    return opt ? opt.label : String(val);
  }

  isSelected(val: string | number): boolean {
    return this.selected().includes(val);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) {
      this.open.set(false);
      this.focused.set(false);
    }
  }

  writeValue(val: (string | number)[]): void { this.selected.set(val ?? []); }
  registerOnChange(fn: (v: (string | number)[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void                       { this.onTouched = fn; }
}
