import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputSize  = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true,
  }],
})
export class InputComponent implements ControlValueAccessor {
  readonly type        = input<string>('text');
  readonly placeholder = input<string>('');
  readonly size        = input<InputSize>('md');
  readonly state       = input<InputState>('default');
  readonly iconLeft    = input<string>('');
  readonly iconRight   = input<string>('');

  readonly valueChange = output<string>();

  readonly focused = signal(false);
  readonly internalValue = signal('');

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly inputClasses = computed(() => ({
    'ds-input': true,
    'ds-input--sm':       this.size() === 'sm',
    'ds-input--lg':       this.size() === 'lg',
    'ds-input--focus':    this.focused(),
    'ds-input--error':    this.state() === 'error',
    'ds-input--success':  this.state() === 'success',
    'ds-input--disabled': this.state() === 'disabled',
    'ds-input--icon-right': !!this.iconRight(),
  }));

  onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void  { this.focused.set(true);  this.onTouched(); }
  onBlur(): void   { this.focused.set(false); }

  writeValue(val: string): void { this.internalValue.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void  { this.onChange = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void {
    // handled via state input
  }
}
