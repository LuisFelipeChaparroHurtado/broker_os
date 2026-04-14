import {
  Component, ChangeDetectionStrategy, computed,
  inject, input, output, signal,
} from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule,
  ValidationErrors, Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { BtnComponent } from '../../../../shared/components/actions/btn/btn.component';
import { CheckboxComponent } from '../../../../shared/components/forms/checkbox/checkbox.component';
import { InputComponent } from '../../../../shared/components/forms/input/input.component';
import { PasswordToggleComponent } from '../../../../shared/components/forms/password-toggle/password-toggle.component';
import { LinkComponent } from '../../../../shared/components/actions/link/link.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/forms/select/select.component';
import { CountriesService } from '../../../../core/services/countries.service';
import { Country } from '../../../../core/models/common';
import { minAge, passwordChecks, passwordComplexity } from '../../../../shared/utils/validators';

// ── Domain types ─────────────────────────────────────────────────────────────

export interface RegisterPayload {
  nombre:          string;
  apellido:        string;
  email:           string;
  fechaNacimiento: string;
  codigoPais:      string;
  telefono:        string;
  pais:            string;
  direccion:       string;
  password:        string;
}

interface StrengthLevel {
  label:    string;
  cssClass: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STRENGTH_LEVELS: StrengthLevel[] = [
  { label: 'Débil',   cssClass: 'weak'   },
  { label: 'Regular', cssClass: 'fair'   },
  { label: 'Buena',   cssClass: 'good'   },
  { label: 'Fuerte',  cssClass: 'strong' },
];

// ── Group-level validator ─────────────────────────────────────────────────────

function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pw      = group.get('password')?.value as string;
  const confirm = group.get('confirmPassword')?.value as string;
  return pw && confirm && pw !== confirm ? { passwordsMismatch: true } : null;
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    PasswordToggleComponent,
    BtnComponent,
    LinkComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly fb               = inject(FormBuilder);
  private readonly countriesService = inject(CountriesService);

  // ── Inputs / Outputs ───────────────────────────────────────────────────────
  readonly isLoading    = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<RegisterPayload>();
  readonly loginLink  = output<void>();

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly showPassword        = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly strengthSegments = [0, 1, 2, 3] as const;

  // ── Catálogo de países desde /api/v1/countries ─────────────────────────────
  private readonly _countries = toSignal(
    this.countriesService.list({ status: 'AC' }).pipe(
      catchError(() => of<Country[]>([])),
    ),
    { initialValue: [] as Country[] },
  );

  /** Options del select de país — value = UUID (lo que el API espera), label = nombre. */
  readonly countries = computed<SelectOption[]>(() =>
    this._countries()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => ({ value: c.id, label: c.name })),
  );

  /**
   * Options del select de prefijo telefónico — value = '+57', label = '+57 (CO)'.
   * Deduplica por `phone_indicator` (ej. +1 lo comparten US y CA).
   */
  readonly countryCodes = computed<SelectOption[]>(() => {
    const seen = new Set<number>();
    const opts: SelectOption[] = [];
    for (const c of this._countries()) {
      if (seen.has(c.phone_indicator)) continue;
      seen.add(c.phone_indicator);
      opts.push({
        value: `+${c.phone_indicator}`,
        label: `+${c.phone_indicator} (${c.iso_code})`,
      });
    }
    return opts.sort((a, b) => String(a.value).localeCompare(String(b.value)));
  });

  // ── Reactive form ─────────────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group(
    {
      nombre:          ['', [Validators.required]],
      apellido:        ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, minAge(18)]],
      codigoPais:      ['', [Validators.required]],
      telefono:        ['', [Validators.required]],
      pais:            ['', [Validators.required]],
      direccion:       ['', [Validators.required]],
      password:        ['', [Validators.required, Validators.minLength(8), passwordComplexity]],
      confirmPassword: ['', [Validators.required]],
      terms:           [false, [Validators.requiredTrue]],
    },
    { validators: passwordsMatchValidator },
  );

  // ── Reactive signals from form observables ─────────────────────────────────
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

  // ── Computed ───────────────────────────────────────────────────────────────
  /**
   * Usa `passwordChecks` del helper compartido para que la regex del
   * carácter especial sea exactamente la misma que el validator del form.
   * Evita que el strength meter marque "Fuerte" mientras el submit dice
   * "falta carácter especial".
   */
  readonly strengthScore = computed((): number => {
    const val = this._password();
    if (!val) return 0;
    const c = passwordChecks(val);
    let score = 0;
    if (c.length)                    score++;
    if (c.lowercase && c.uppercase)  score++;
    if (c.digit)                     score++;
    if (c.special)                   score++;
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
    this._formStatus() === 'VALID' && !this.isLoading(),
  );

  // ── Error getters (evaluated after markAllAsTouched on submit) ─────────────
  get nombreError(): string {
    const c = this.form.controls.nombre;
    return c.invalid && c.touched ? 'Campo obligatorio' : '';
  }

  get apellidoError(): string {
    const c = this.form.controls.apellido;
    return c.invalid && c.touched ? 'Campo obligatorio' : '';
  }

  get emailError(): string {
    const c = this.form.controls.email;
    return c.invalid && c.touched ? 'Introduce un correo electrónico válido' : '';
  }

  get fechaError(): string {
    const c = this.form.controls.fechaNacimiento;
    if (!c.touched || c.valid) return '';
    if (c.hasError('required'))    return 'Campo obligatorio';
    if (c.hasError('invalidDate')) return 'Fecha inválida';
    if (c.hasError('minAge'))      return 'Debes ser mayor de 18 años';
    return 'Fecha inválida';
  }

  get telefonoError(): string {
    const c = this.form.controls.telefono;
    return c.invalid && c.touched ? 'Campo obligatorio' : '';
  }

  get paisError(): string {
    const c = this.form.controls.pais;
    return c.invalid && c.touched ? 'Selecciona un país' : '';
  }

  get direccionError(): string {
    const c = this.form.controls.direccion;
    return c.invalid && c.touched ? 'Campo obligatorio' : '';
  }

  get passwordError(): string {
    const c = this.form.controls.password;
    if (!c.touched || c.valid) return '';
    if (c.hasError('required'))    return 'Campo obligatorio';
    if (c.hasError('minlength'))   return 'Mínimo 8 caracteres';
    if (c.hasError('noLowercase')) return 'Falta una letra minúscula';
    if (c.hasError('noUppercase')) return 'Falta una letra mayúscula';
    if (c.hasError('noDigit'))     return 'Falta un número';
    if (c.hasError('noSpecial'))   return 'Falta un carácter especial (!@#$%^&*)';
    return 'Contraseña inválida';
  }

  get confirmPasswordError(): string {
    const c = this.form.controls.confirmPassword;
    if (!c.touched) return '';
    if (c.hasError('required')) return 'Campo obligatorio';
    if (this.form.hasError('passwordsMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  get termsError(): boolean {
    const c = this.form.controls.terms;
    return c.invalid && c.touched;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { nombre, apellido, email, fechaNacimiento, codigoPais, telefono, pais, direccion, password } =
        this.form.getRawValue();
      this.submitForm.emit({ nombre, apellido, email, fechaNacimiento, codigoPais, telefono, pais, direccion, password });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
