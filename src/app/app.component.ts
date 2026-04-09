import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastOutletComponent } from './shared/components/feedback/toast/toast.component';
import { ModalOutletComponent } from './shared/components/feedback/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastOutletComponent, ModalOutletComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast-outlet></app-toast-outlet>
    <app-modal-outlet></app-modal-outlet>
  `,
  styles: [`:host { display: block; height: 100vh; }`],
})
export class AppComponent {}
