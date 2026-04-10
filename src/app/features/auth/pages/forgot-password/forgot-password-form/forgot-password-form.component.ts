import {
  Component, ChangeDetectionStrategy, computed, inject, input, output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, BtnComponent, LinkComponent],
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

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.controls.email.value.trim());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
