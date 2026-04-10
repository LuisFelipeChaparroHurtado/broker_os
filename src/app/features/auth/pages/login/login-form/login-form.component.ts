import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { CheckboxComponent } from '../../../../../shared/components/forms/checkbox/checkbox.component';
import { PasswordToggleComponent } from '../../../../../shared/components/forms/password-toggle/password-toggle.component';
import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';
import { TfaMethodSelectorComponent, TfaMethod } from '../../../shared/tfa-method-selector/tfa-method-selector.component';

export type { TfaMethod };

export interface LoginSubmitPayload {
  email: string;
  password: string;
  method: TfaMethod;
}

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, CheckboxComponent, PasswordToggleComponent, BtnComponent, LinkComponent, TfaMethodSelectorComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<LoginSubmitPayload>();
  readonly forgotPassword = output<void>();
  readonly register = output<void>();

  readonly showPassword = signal(false);
  readonly selectedMethod = signal<TfaMethod>('email');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false],
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  selectMethod(method: TfaMethod): void {
    if (this.isLoading()) return;
    this.selectedMethod.set(method);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.submitForm.emit({ email, password, method: this.selectedMethod() });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get emailError(): string {
    const c = this.form.controls.email;
    return c.invalid && c.touched ? 'Introduce un correo electronico valido' : '';
  }

  get passwordError(): string {
    const c = this.form.controls.password;
    return c.invalid && c.touched ? 'La contrasena debe tener al menos 8 caracteres' : '';
  }

  get canSubmit(): boolean {
    return this.form.valid && !this.isLoading();
  }
}
