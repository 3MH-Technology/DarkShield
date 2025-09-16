import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
import { Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="flex items-start p-4 w-full max-w-xs text-gray-200 rounded-lg shadow-2xl shadow-cyan-500/10 backdrop-blur-lg" 
         [class]="toastClasses()">
      <div [class]="iconWrapperClasses()" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        <!-- Icon SVG -->
        @switch (toast().type) {
          @case('success') {
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
          }
          @case ('error') {
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
            </svg>
          }
           @case ('info') {
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
          }
        }
        <span class="sr-only">Icon</span>
      </div>
      <div class="ms-3 text-sm font-normal">{{ toast().message }}</div>
      <button type="button" (click)="close.emit()"
              class="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-400 hover:text-white bg-white/0 hover:bg-white/10 transition-colors" 
              aria-label="Close">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      animation: slide-in 0.3s ease-out forwards;
    }

    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  toast = input.required<Toast>();
  @Output() close = new EventEmitter<void>();

  toastClasses = computed(() => {
    const type = this.toast().type;
    return {
      'success': 'bg-green-900/80 border border-green-500/50',
      'error': 'bg-red-900/80 border border-red-500/50',
      'info': 'bg-blue-900/80 border border-blue-500/50'
    }[type];
  });

  iconWrapperClasses = computed(() => {
     const type = this.toast().type;
    return {
      'success': 'bg-green-800 text-green-200',
      'error': 'bg-red-800 text-red-200',
      'info': 'bg-blue-800 text-blue-200'
    }[type];
  });
}
