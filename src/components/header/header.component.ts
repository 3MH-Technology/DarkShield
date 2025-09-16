import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-gray-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-700/50">
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-3 text-white" (click)="closeMenu()">
               <svg class="h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1L3 5V11C3 16.55 7.84 21.74 12 23C16.16 21.74 21 16.55 21 11V5L12 1ZM12 12H19C18.47 16.12 15.72 19.79 12 20.94V12H5V6.3L12 3.19V12Z" />
              </svg>
              <span class="font-orbitron text-2xl font-black tracking-wider uppercase">DarkShield</span>
            </a>
          </div>
          
          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center space-x-8">
             <a routerLink="/" routerLinkActive="text-cyan-400" [routerLinkActiveOptions]="{exact: true}" class="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold text-lg">Home</a>
             <a routerLink="/about" routerLinkActive="text-cyan-400" class="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold text-lg">About</a>
             @if (currentUser()) {
               @if(isAdmin()) {
                <a routerLink="/dashboard" routerLinkActive="text-cyan-400" class="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold text-lg">Dashboard</a>
               }
               <div class="flex items-center space-x-4">
                 <span class="text-gray-300 font-semibold">{{ currentUser()?.name }}</span>
                 <button (click)="logout()" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Logout</button>
               </div>
             } @else {
               <a routerLink="/login" routerLinkActive="text-cyan-400" class="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-semibold text-lg">Login</a>
                <a routerLink="/register" class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors">Register</a>
             }
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button (click)="toggleMenu()" class="text-gray-300 hover:text-white focus:outline-none">
              <svg class="h-8 w-8" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                @if (!isMenuOpen()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (isMenuOpen()) {
        <div class="md:hidden absolute top-20 left-0 w-full bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50"
             (click)="closeMenu()">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a routerLink="/" routerLinkActive="bg-cyan-500 text-white" [routerLinkActiveOptions]="{exact: true}" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a routerLink="/about" routerLinkActive="bg-cyan-500 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
            @if(currentUser()) {
              @if (isAdmin()) {
                <a routerLink="/dashboard" routerLinkActive="bg-cyan-500 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
              }
              <div class="px-3 py-2">
                 <span class="text-gray-400 font-semibold text-base block mb-2">{{ currentUser()?.name }}</span>
                 <button (click)="logout()" class="w-full text-left bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded-md text-base transition-colors">Logout</button>
              </div>
            } @else {
              <a routerLink="/login" routerLinkActive="bg-cyan-500 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Login</a>
              <a routerLink="/register" routerLinkActive="bg-cyan-500 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Register</a>
            }
          </div>
        </div>
      }
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
  }
}