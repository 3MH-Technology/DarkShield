import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs';
import { ModalComponent } from './components/modal/modal.component';
import { ModalService } from './services/modal.service';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ModalComponent, ToastContainerComponent],
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);
  private el = inject(ElementRef);
  private router = inject(Router);
  
  modalService = inject(ModalService);
  toastService = inject(ToastService);

  isLoading = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading.set(true);
      } else {
        // Use a small delay to prevent flickering on fast loads
        setTimeout(() => this.isLoading.set(false), 300);
      }
    });
  }

  ngOnInit() {
    this.createMatrixBackground();
  }
  
  private createMatrixBackground() {
    const bgContainer = this.renderer.createElement('div');
    this.renderer.addClass(bgContainer, 'matrix-bg');
    this.renderer.setStyle(bgContainer, 'opacity', '0.3');
    this.renderer.appendChild(this.el.nativeElement.parentElement, bgContainer);

    const chars = '0123456789ABCDEF';
    const numChars = 150; // Reduced for subtlety

    for (let i = 0; i < numChars; i++) {
        const charElement = this.renderer.createElement('span');
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const text = this.renderer.createText(randomChar);
        this.renderer.appendChild(charElement, text);
        this.renderer.addClass(charElement, 'matrix-char');
        this.renderer.setStyle(charElement, 'left', `${Math.random() * 100}vw`);
        const duration = Math.random() * 6 + 4; // Slower fall
        const delay = Math.random() * 10;
        this.renderer.setStyle(charElement, 'animation-duration', `${duration}s`);
        this.renderer.setStyle(charElement, 'animation-delay', `${delay}s`);
        this.renderer.setStyle(charElement, 'transform', `translateY(-${Math.random() * 100}vh)`);
        this.renderer.appendChild(bgContainer, charElement);
    }
  }
}
