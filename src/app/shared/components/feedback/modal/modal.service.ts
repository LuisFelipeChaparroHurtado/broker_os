import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title:        string;
  message?:     string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:       boolean;
}

export interface ModalState extends ModalConfig {
  open:    boolean;
  resolve: ((confirmed: boolean) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly state = signal<ModalState>({
    open: false, title: '', resolve: null,
  });

  /** Abre el modal y devuelve una Promise<boolean> */
  confirm(config: ModalConfig): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({ ...config, open: true, resolve });
    });
  }

  confirm_(confirmed: boolean): void {
    this.state().resolve?.(confirmed);
    this.state.update(s => ({ ...s, open: false, resolve: null }));
  }
}
