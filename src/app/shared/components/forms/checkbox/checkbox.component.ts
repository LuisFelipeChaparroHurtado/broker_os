import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label         = input<string>('');
  readonly indeterminate = input<boolean>(false);
  readonly disabled      = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  readonly checked = signal(false);

  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  readonly boxClasses = computed(() => ({
    'ds-checkbox-box': true,
    'ds-checkbox-box--checked':       this.checked() && !this.indeterminate(),
    'ds-checkbox-box--indeterminate': this.indeterminate(),
    'ds-checkbox-box--disabled':      this.disabled(),
  }));

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
    this.checkedChange.emit(next);
  }

  writeValue(val: boolean): void { this.checked.set(!!val); }
  registerOnChange(fn: (v: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }
}
