# Prompt: Generar Componente dentro de `auth/login`

Usa este prompt cuando necesites agregar un **nuevo componente** dentro de una feature de autenticación ya existente (`features/auth/login`).

---

## Cómo invocar

Copia y pega el bloque de abajo, reemplazando los valores entre `< >`:

````
Genera un nuevo componente Angular dentro de la feature `auth/login`.

## Contexto del proyecto
Lee y aplica:
- claude/context/project-overview.md
- claude/context/ui-guidelines.md
- claude/skills/angular-architecture.md
- claude/skills/angular-components.md
- claude/skills/angular-best-practices.md

## Componente a generar
Nombre: <NOMBRE_COMPONENTE>
Ruta destino: `src/app/features/auth/login/components/<nombre-componente>/`
Descripción: <QUÉ HACE ESTE COMPONENTE>

## Tipo de componente
<!-- Marca con X el que aplica -->
- [ ] Presentacional (solo recibe inputs y emite outputs — sin lógica de negocio)
- [ ] Contenedor (consume store/service directamente)
- [ ] Formulario (usa ReactiveFormsModule o app-dynamic-form)

## Inputs esperados
```typescript
// Ejemplo:
email    : InputSignal<string>
isLoading: InputSignal<boolean>
````

## Outputs esperados

```typescript
// Ejemplo:
submitForm: OutputEmitterRef<LoginFormValue>;
forgotPassword: OutputEmitterRef<void>;
```

## Template / comportamiento esperado

<DESCRIPCIÓN BREVE DEL HTML QUE DEBE RENDERIZAR>

## Archivos a generar (en orden)

1. `src/app/features/auth/login/components/<nombre>/<nombre>.component.ts`
2. `src/app/features/auth/login/components/<nombre>/<nombre>.component.html`
3. `src/app/features/auth/login/components/<nombre>/<nombre>.component.scss`
4. `src/app/features/auth/login/components/<nombre>/<nombre>.component.spec.ts`

## Reglas obligatorias

- `standalone: true` + `ChangeDetectionStrategy.OnPush`
- Sin `any` — TypeScript estricto
- Inputs con `input()` signal, outputs con `output()`
- Sin lógica de negocio en componentes presentacionales
- Estilos solo con variables de `ui-guidelines.md` (design tokens)
- Spec con al menos: render, inputs, outputs y snapshot
- Código completo y funcional — sin esqueletos vacíos

```

---

## Ejemplo de invocación real

```

Genera un nuevo componente Angular dentro de la feature `auth/login`.

## Contexto del proyecto

[ver archivos arriba]

## Componente a generar

Nombre: login-form
Ruta destino: `src/app/features/auth/login/components/login-form/`
Descripción: Formulario de inicio de sesión con campos email y password, botón submit y enlace "¿Olvidaste tu contraseña?".

## Tipo de componente

- [x] Formulario (usa ReactiveFormsModule)

## Inputs esperados

isLoading: InputSignal<boolean>
errorMessage: InputSignal<string | null>

## Outputs esperados

submitForm: OutputEmitterRef<{ email: string; password: string }>
forgotPassword: OutputEmitterRef<void>

## Template / comportamiento esperado

- Campo email con validación required + email
- Campo password con validación required + minLength(8) + toggle show/hide
- Botón "Iniciar sesión" deshabilitado mientras isLoading sea true
- Mensaje de error visible si errorMessage no es null
- Link "¿Olvidaste tu contraseña?" que emite forgotPassword

## Archivos a generar

1. src/app/features/auth/login/components/login-form/login-form.component.ts
2. src/app/features/auth/login/components/login-form/login-form.component.html
3. src/app/features/auth/login/components/login-form/login-form.component.scss
4. src/app/features/auth/login/components/login-form/login-form.component.spec.ts

```

---

## Checklist de validación del output

Antes de aceptar el código generado, verificar:

- [ ] Los 4 archivos están generados (`.ts`, `.html`, `.scss`, `.spec.ts`)
- [ ] `standalone: true` declarado en el decorador
- [ ] `ChangeDetectionStrategy.OnPush` aplicado
- [ ] Todos los inputs usan `input<T>()` (signal API)
- [ ] Todos los outputs usan `output<T>()`
- [ ] Sin lógica de negocio si es presentacional (sin llamadas a servicios ni store)
- [ ] El `.scss` usa solo design tokens del proyecto
- [ ] El `.spec.ts` cubre: render básico, binding de inputs, emisión de outputs
- [ ] No hay `any` en ningún archivo
- [ ] El componente está exportado y listo para importarse en `login.page.ts`
```
