import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';
import { ToastComponent } from './toast.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastComponent],
  template: `
    <div class="fixed top-24 right-4 z-[2000] space-y-3">
      @for (toast of toasts(); track toast.id) {
        <app-toast [toast]="toast" (close)="onClose(toast.id)"></app-toast>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  toasts = input.required<Toast[]>();
  private toastService = inject(ToastService);

  onClose(id: number) {
    this.toastService.remove(id);
  }
}
