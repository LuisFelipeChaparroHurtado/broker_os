import {
  Component, ChangeDetectionStrategy, input, output,
  signal, computed, forwardRef
} from '@angular/core';

import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true,
  }],
})
export class TextareaComponent implements ControlValueAccessor {
  readonly placeholder = input<string>('');
  readonly maxLength   = input<number>(0);
  readonly rows        = input<number>(4);
  readonly hasError    = input<boolean>(false);

  readonly valueChange = output<string>();

  readonly focused       = signal(false);
  readonly internalValue = signal('');

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  readonly charCountLabel = computed(() => {
    const max = this.maxLength();
    if (!max) return '';
    return `${this.internalValue().length} / ${max}`;
  });

  readonly textareaClasses = computed(() => ({
    'ds-textarea': true,
    'ds-textarea--focus': this.focused(),
    'ds-textarea--error': this.hasError(),
  }));

  onInput(e: Event): void {
    const val = (e.target as HTMLTextAreaElement).value;
    this.internalValue.set(val);
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onFocus(): void { this.focused.set(true);  this.onTouched(); }
  onBlur(): void  { this.focused.set(false); }

  writeValue(val: string): void { this.internalValue.set(val ?? ''); }
  registerOnChange(fn: (v: string) => void): void  { this.onChange = fn; }
  registerOnTouched(fn: () => void): void           { this.onTouched = fn; }
}
