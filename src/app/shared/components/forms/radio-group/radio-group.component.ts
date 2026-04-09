import {
  Component, ChangeDetectionStrategy, input, output,
  signal, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  templateUrl: './radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true,
  }],
})
export class RadioGroupComponent implements ControlValueAccessor {
  readonly options  = input.required<RadioOption[]>();
  readonly name     = input<string>('radio-group');
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<string | number>();

  readonly selected = signal<string | number>('');

  private onChange: (v: string | number) => void = () => {};
  private onTouched: () => void = () => {};

  select(value: string | number): void {
    if (this.disabled()) return;
    this.selected.set(value);
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  writeValue(val: string | number): void { this.selected.set(val ?? ''); }
  registerOnChange(fn: (v: string | number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void                   { this.onTouched = fn; }
}
