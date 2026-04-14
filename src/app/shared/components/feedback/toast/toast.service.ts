import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info' | 'mint';

export interface ToastItem {
  id:        string;
  variant:   ToastVariant;
  title:     string;
  message?:  string;
  /** Duración total del toast en ms (para animar la barra de progreso). */
  duration:  number;
  /** Flag para disparar la animación de salida antes del remove real. */
  removing:  boolean;
}

/** Tiempo en ms que dura la animación de salida (ver toast.component.scss). */
const EXIT_ANIMATION_MS = 220;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  private add(variant: ToastVariant, title: string, message?: string, duration = 4500): void {
    const id = crypto.randomUUID();
    this.toasts.update((list) => [
      ...list,
      { id, variant, title, message, duration, removing: false },
    ]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message?: string): void { this.add('success', title, message); }
  error  (title: string, message?: string): void { this.add('error',   title, message, 6000); }
  info   (title: string, message?: string): void { this.add('info',    title, message); }
  mint   (title: string, message?: string): void { this.add('mint',    title, message); }

  /**
   * Marca el toast como `removing` para disparar la animación de salida,
   * y lo elimina del array una vez la animación terminó.
   */
  remove(id: string): void {
    const existing = this.toasts().find((t) => t.id === id);
    if (!existing || existing.removing) return;

    this.toasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, removing: true } : t)),
    );

    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, EXIT_ANIMATION_MS);
  }
}
