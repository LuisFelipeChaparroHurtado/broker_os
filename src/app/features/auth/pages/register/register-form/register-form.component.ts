import {
  Component, ChangeDetectionStrategy, computed,
  inject, input, output, signal,
} from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule,
  ValidationErrors, Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { BtnComponent } from '../../../../../shared/components/actions/btn/btn.component';
import { CheckboxComponent } from '../../../../../shared/components/forms/checkbox/checkbox.component';
import { InputComponent } from '../../../../../shared/components/forms/input/input.component';
import { LinkComponent } from '../../../../../shared/components/actions/link/link.component';
import { SelectComponent, SelectOption } from '../../../../../shared/components/forms/select/select.component';

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

const COUNTRY_CODES: SelectOption[] = [
  { value: '+1',  label: '+1 (US/CA)' },
  { value: '+34', label: '+34 (ES)'   },
  { value: '+52', label: '+52 (MX)'   },
  { value: '+57', label: '+57 (CO)'   },
  { value: '+44', label: '+44 (UK)'   },
  { value: '+49', label: '+49 (DE)'   },
  { value: '+81', label: '+81 (JP)'   },
  { value: '+86', label: '+86 (CN)'   },
  { value: '+55', label: '+55 (BR)'   },
  { value: '+54', label: '+54 (AR)'   },
  { value: '+56', label: '+56 (CL)'   },
];

const COUNTRIES: SelectOption[] = [
  { value: 'US',    label: 'Estados Unidos' },
  { value: 'ES',    label: 'España'         },
  { value: 'MX',    label: 'México'         },
  { value: 'CO',    label: 'Colombia'       },
  { value: 'UK',    label: 'Reino Unido'    },
  { value: 'DE',    label: 'Alemania'       },
  { value: 'JP',    label: 'Japón'          },
  { value: 'CN',    label: 'China'          },
  { value: 'BR',    label: 'Brasil'         },
  { value: 'AR',    label: 'Argentina'      },
  { value: 'CL',    label: 'Chile'          },
  { value: 'OTHER', label: 'Otro'           },
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
    BtnComponent,
    LinkComponent,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);

  // ── Inputs / Outputs ───────────────────────────────────────────────────────
  readonly isLoading    = input(false);
  readonly errorMessage = input<string | null>(null);

  readonly submitForm = output<RegisterPayload>();
  readonly loginLink  = output<void>();

  // ── UI state ───────────────────────────────────────────────────────────────
  readonly showPassword        = signal(false);
  readonly showConfirmPassword = signal(false);

  // ── Static data ───────────────────────────────────────────────────────────
  readonly countryCodes: SelectOption[] = COUNTRY_CODES;
  readonly countries: SelectOption[]    = COUNTRIES;
  readonly strengthSegments             = [0, 1, 2, 3] as const;

  // ── Reactive form ─────────────────────────────────────────────────────────
  readonly form = this.fb.nonNullable.group(
    {
      nombre:          ['', [Validators.required]],
      apellido:        ['', [Validators.required]],
      email:           ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required]],
      codigoPais:      ['+1', [Validators.required]],
      telefono:        ['', [Validators.required]],
      pais:            ['', [Validators.required]],
      direccion:       ['', [Validators.required]],
      password:        ['', [Validators.required, Validators.minLength(8)]],
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
  readonly strengthScore = computed((): number => {
    const val = this._password();
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8)                          score++;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val))  score++;
    if (/\d/.test(val))                           score++;
    if (/[^a-zA-Z0-9]/.test(val))                score++;
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
    return c.invalid && c.touched ? 'Campo obligatorio' : '';
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
