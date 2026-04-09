import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  readonly label       = input<string>('');
  readonly helper      = input<string>('');
  readonly error       = input<string>('');
  readonly charCount   = input<string>('');  // e.g. "42 / 500"
  readonly required    = input<boolean>(false);
}
