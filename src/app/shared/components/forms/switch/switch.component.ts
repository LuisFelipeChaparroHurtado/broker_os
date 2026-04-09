import {
  Component, ChangeDetectionStrategy, input, output,
  signal, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchComponent),
    multi: true,
  }],
})
export class SwitchComponent implements ControlValueAccessor {
  readonly label    = input<string>('');
  readonly size     = input<'sm' | 'md'>('md');
  readonly disabled = input<boolean>(false);

  readonly valueChange = output<boolean>();

  readonly checked = signal(false);

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
    this.valueChange.emit(next);
  }

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }
}
