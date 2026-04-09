import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
})
export class SelectComponent implements ControlValueAccessor {
  readonly options      = input.required<SelectOption[]>();
  readonly placeholder  = input<string>('Seleccionar...');
  readonly hasError     = input<boolean>(false);
  readonly disabled     = input<boolean>(false);

  readonly valueChange = output<string | number>();

  readonly focused       = signal(false);
  readonly internalValue = signal<string | number>('');

  private onChange: (v: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  readonly selectClasses = computed(() => ({
    'ds-select': true,
    'ds-select--focus': this.focused(),
    'ds-select--error': this.hasError(),
  }));

  onSelect(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.internalValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void { this.focused.set(true);  this.onTouched(); }
  onBlur(): void  { this.focused.set(false); }

  writeValue(val: string | number): void { this.internalValue.set(val ?? ''); }
  registerOnChange(fn: (v: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void                   { this.onTouched = fn; }
}
