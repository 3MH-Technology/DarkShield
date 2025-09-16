import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  isOpen = signal(false);
  modalConfig = signal<ModalConfig>({ title: '', message: '' });

  private resolvePromise!: (value: boolean) => void;

  open(config: ModalConfig): Promise<boolean> {
    this.modalConfig.set(config);
    this.isOpen.set(true);
    return new Promise<boolean>(resolve => {
      this.resolvePromise = resolve;
    });
  }

  confirm() {
    this.isOpen.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(true);
    }
  }

  cancel() {
    this.isOpen.set(false);
    if (this.resolvePromise) {
      this.resolvePromise(false);
    }
  }
}
