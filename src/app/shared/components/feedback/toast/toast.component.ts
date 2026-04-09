import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ToastService, ToastVariant, ToastItem } from './toast.service';

const DOT_CLASSES: Record<ToastVariant, string> = {
  success: 'ds-toast-dot--success',
  error:   'ds-toast-dot--error',
  info:    'ds-toast-dot--info',
  mint:    'ds-toast-dot--mint',
};

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl:    './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutletComponent {
  readonly toastService = inject(ToastService);

  dotClass(variant: ToastVariant): string { return DOT_CLASSES[variant]; }
  trackById(_: number, item: ToastItem): string { return item.id; }
}
