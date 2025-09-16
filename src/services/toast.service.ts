import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(toastData: Omit<Toast, 'id'>) {
    const id = this.nextId++;
    const newToast: Toast = { id, ...toastData };
    
    this.toasts.update(currentToasts => [...currentToasts, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, toastData.duration || 4000);
  }

  remove(id: number) {
    this.toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }
}
