import {
  Component, ChangeDetectionStrategy, computed, inject, input, output, signal,
} from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule,
  ValidationErrors, Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';

interface StrengthLevel {
  label:    string;
  cssClass: string;
}

interface PasswordChecks {
  length:  boolean;
  upper:   boolean;
  number:  boolean;
  special: boolean;
}

const STRENGTH_LEVELS: StrengthLevel[] = [
  { label: 'Débil',   cssClass: 'weak'   },
  { label: 'Regular', cssClass: 'fair'   },
  { label: 'Buena',   cssClass: 'good'   },
  { label: 'Fuerte',  cssClass: 'strong' },
];

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw      = group.get('password')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  return pw && confirm && pw !== confirm ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-new-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, BtnComponent, LinkComponent],
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPasswordFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly isLoading    = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly successState = input(false);

  readonly submitForm = output<string>();
  readonly loginLink  = output<void>();

  readonly showPassword        = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly strengthSegments = [0, 1, 2, 3] as const;

  readonly form = this.fb.nonNullable.group(
    {
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  private readonly _password = toSignal(
    this.form.controls.password.valueChanges,
    { initialValue: '' },
  );

  private readonly _confirm = toSignal(
    this.form.controls.confirmPassword.valueChanges,
    { initialValue: '' },
  );

  private readonly _formStatus = toSignal(
    this.form.statusChanges,
    { initialValue: this.form.status },
  );

  readonly requirements = computed((): PasswordChecks => {
    const v = this._password();
    return {
      length:  v.length >= 8,
      upper:   /[A-Z]/.test(v),
      number:  /\d/.test(v),
      special: /[^a-zA-Z0-9]/.test(v),
    };
  });

  readonly strengthScore = computed((): number => {
    const r = this.requirements();
    let score = 0;
    if (r.length)  score++;
    if (r.upper)   score++;
    if (r.number)  score++;
    if (r.special) score++;
    return score;
  });

  readonly strengthLabel = computed((): string => {
    const score = this.strengthScore();
    return score > 0 ? (STRENGTH_LEVELS[score - 1]?.label ?? '') : '';
  });

  readonly strengthClass = computed((): string => {
    const score = this.strengthScore();
    return score > 0 ? (STRENGTH_LEVELS[score - 1]?.cssClass ?? '') : '';
  });

  readonly passwordHasValue = computed((): boolean => this._password().length > 0);

  readonly passwordsMatch = computed((): boolean => {
    const pw = this._password();
    const cf = this._confirm();
    return !!pw && !!cf && pw === cf;
  });

  readonly showMatchIndicator = computed((): boolean => this._confirm().length > 0);

  readonly canSubmit = computed((): boolean =>
    this._formStatus() === 'VALID' && !this.isLoading() && !this.successState(),
  );

  get passwordError(): string {
    const c = this.form.controls.password;
    if (!c.touched || c.valid) return '';
    if (c.hasError('minlength')) return 'La contraseña debe tener al menos 8 caracteres';
    return 'Campo obligatorio';
  }

  get confirmPasswordError(): string {
    const c = this.form.controls.confirmPassword;
    if (!c.touched) return '';
    if (c.hasError('required')) return 'Campo obligatorio';
    if (this.form.hasError('passwordsMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm.emit(this.form.controls.password.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
