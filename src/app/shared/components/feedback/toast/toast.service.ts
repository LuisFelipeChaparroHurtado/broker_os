import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info' | 'mint';

export interface ToastItem {
  id:      string;
  variant: ToastVariant;
  title:   string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);

  private add(variant: ToastVariant, title: string, message?: string, duration = 4000): void {
    const id = crypto.randomUUID();
    this.toasts.update(list => [...list, { id, variant, title, message }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(title: string, message?: string): void { this.add('success', title, message); }
  error  (title: string, message?: string): void { this.add('error',   title, message, 6000); }
  info   (title: string, message?: string): void { this.add('info',    title, message); }
  mint   (title: string, message?: string): void { this.add('mint',    title, message); }

  remove(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
