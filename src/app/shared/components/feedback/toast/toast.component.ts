import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ToastService, ToastItem, ToastVariant } from './toast.service';

@Component({
  selector: 'app-toast-outlet',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl:    './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastOutletComponent {
  readonly toastService = inject(ToastService);

  trackById(_: number, item: ToastItem): string {
    return item.id;
  }

  variantClass(variant: ToastVariant): string {
    return `ds-toast--${variant}`;
  }
}
