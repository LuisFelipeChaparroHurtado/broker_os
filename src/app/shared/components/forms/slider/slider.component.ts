import {
  Component, ChangeDetectionStrategy, input, output,
  signal, forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [],
  templateUrl: './slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SliderComponent),
    multi: true,
  }],
})
export class SliderComponent implements ControlValueAccessor {
  readonly min        = input<number>(0);
  readonly max        = input<number>(100);
  readonly step       = input<number>(1);
  readonly value      = input<number>(50);
  readonly showValue  = input<boolean>(true);
  readonly showLabels = input<boolean>(true);
  readonly disabled   = input<boolean>(false);

  readonly valueChange = output<number>();

  readonly internalValue = signal(50);

  private onChange: (v: number) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(e: Event): void {
    if (this.disabled()) return;
    const val = +(e.target as HTMLInputElement).value;
    this.internalValue.set(val);
    this.onChange(val);
    this.onTouched();
    this.valueChange.emit(val);
  }

  writeValue(val: number): void { this.internalValue.set(val ?? 50); }
  registerOnChange(fn: (v: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void          { this.onTouched = fn; }
}
