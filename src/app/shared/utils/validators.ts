import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Regex que define qué cuenta como "carácter especial" según el backend.
 * Single source of truth — usado por el validator Y por la UI del strength
 * meter / checklist de requisitos, para que nunca diverjan.
 */
const SPECIAL_CHAR_REGEX = /[!@#$%^&*]/;

/** Chequea cada regla de complejidad individualmente para alimentar la UI. */
export interface PasswordChecks {
  length:    boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit:     boolean;
  special:   boolean;
}

/**
 * Devuelve el estado de cada regla de complejidad para una contraseña dada.
 * Usado por los forms para pintar el strength meter y el checklist visual.
 * Mantiene la misma regex que `passwordComplexity` → imposible que la UI
 * muestre "OK" y el submit diga "falta carácter especial".
 */
export function passwordChecks(value: string): PasswordChecks {
  return {
    length:    value.length >= 8,
    lowercase: /[a-z]/.test(value),
    uppercase: /[A-Z]/.test(value),
    digit:     /\d/.test(value),
    special:   SPECIAL_CHAR_REGEX.test(value),
  };
}

/**
 * Valida la complejidad de contraseña que exige el API BrokerOS:
 *   - al menos 1 minúscula
 *   - al menos 1 mayúscula
 *   - al menos 1 dígito
 *   - al menos 1 carácter especial (!@#$%^&*)
 *
 * Se aplica junto con `Validators.minLength(8)` para el chequeo de longitud.
 *
 * Devuelve un objeto con TODAS las reglas que faltan (no corta en la primera),
 * para que la UI pueda mostrar exactamente qué condición no cumple.
 */
export function passwordComplexity(control: AbstractControl): ValidationErrors | null {
  const v = control.value as string | null;
  if (!v) return null;

  const checks = passwordChecks(v);
  const errors: ValidationErrors = {};
  if (!checks.lowercase) errors['noLowercase'] = true;
  if (!checks.uppercase) errors['noUppercase'] = true;
  if (!checks.digit)     errors['noDigit']     = true;
  if (!checks.special)   errors['noSpecial']   = true;
  return Object.keys(errors).length ? errors : null;
}

/**
 * Valida que un input de fecha (formato 'YYYY-MM-DD') corresponda a una
 * persona con al menos `years` años cumplidos.
 *
 * Errores posibles:
 *   { invalidDate: true }              — string no parseable
 *   { minAge: { required, actual } }   — es menor a `years` años
 */
export function minAge(years: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value as string | null;
    if (!v) return null;

    const birth = new Date(v);
    if (isNaN(birth.getTime())) return { invalidDate: true };

    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      age--;
    }

    return age >= years ? null : { minAge: { required: years, actual: age } };
  };
}
