import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center animate-fade-in-fast" (click)="onBackdropClick()">
        <div class="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-md m-4 animate-scale-up" (click)="$event.stopPropagation()">
          <div class="p-6">
            <h3 class="font-orbitron text-2xl font-bold text-white">{{ title() }}</h3>
            <p class="mt-2 text-gray-400">{{ message() }}</p>
          </div>
          <div class="bg-gray-800/50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
            <button (click)="onCancel()" class="px-4 py-2 rounded-md font-semibold text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button (click)="onConfirm()" class="px-4 py-2 rounded-md font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors">
              Confirm
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    @keyframes fade-in-fast {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in-fast {
      animation: fade-in-fast 0.2s ease-out forwards;
    }
    @keyframes scale-up {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-up {
      animation: scale-up 0.2s ease-out forwards;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  isOpen = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }

  onBackdropClick() {
    this.onCancel();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.isOpen()) {
      this.onCancel();
    }
  }
}
