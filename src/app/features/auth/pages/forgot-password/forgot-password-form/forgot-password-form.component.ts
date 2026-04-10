import {
  Component, ChangeDetectionStrategy, computed, inject, input, output, signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';
import { TfaMethodSelectorComponent, TfaMethod } from '../../../shared/tfa-method-selector/tfa-method-selector.component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, BtnComponent, LinkComponent, TfaMethodSelectorComponent],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading    = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<string>();
  readonly loginLink  = output<void>();

  readonly selectedMethod = signal<TfaMethod>('email');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  private readonly _formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status },
  );

  readonly canSubmit = computed((): boolean =>
    this._formStatus() === 'VALID' && !this.isLoading(),
  );

  get emailError(): string {
    const c = this.form.controls.email;
    return c.invalid && c.touched ? 'Introduce un correo electrónico válido' : '';
  }

  selectMethod(method: TfaMethod): void {
    if (this.isLoading()) return;
    this.selectedMethod.set(method);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.controls.email.value.trim());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
