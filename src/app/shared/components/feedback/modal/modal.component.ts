import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal-outlet',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl:    './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalOutletComponent {
  readonly modalService = inject(ModalService);

  confirm(value: boolean): void { this.modalService.confirm_(value); }
}
