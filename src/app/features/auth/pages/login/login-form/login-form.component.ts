import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { CheckboxComponent } from '../../../../../shared/components/forms/checkbox/checkbox.component';
import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, CheckboxComponent, BtnComponent, LinkComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<{ email: string; password: string }>();
  readonly forgotPassword = output<void>();
  readonly register = output<void>();

  readonly showPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false],
  });

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.submitForm.emit({ email, password });
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
