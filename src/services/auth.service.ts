import { Injectable, computed, signal, effect, inject } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { Router } from '@angular/router';

const USERS_STORAGE_KEY = 'darkshield_users';
const CURRENT_USER_STORAGE_KEY = 'darkshield_currentUser';
const OWNER_EMAIL = 'm0570398993@gmail.com';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  
  private users = signal<User[]>([]);
  private nextUserId = signal(1);
  currentUser = signal<User | null>(null);

  constructor() {
    this.loadUsersFromStorage();
    this.loadCurrentUserFromStorage();
    
    // Effect to save users to localStorage whenever they change
    effect(() => {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users()));
      localStorage.setItem('darkshield_nextUserId', this.nextUserId().toString());
    });

    // Effect to save current user to localStorage
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    });
  }

  private loadUsersFromStorage() {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    const storedNextId = localStorage.getItem('darkshield_nextUserId');
    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
      this.nextUserId.set(storedNextId ? parseInt(storedNextId, 10) : (this.users().length + 1));
    }
    // Ensure Owner account exists
    this.ensureOwnerExists();
  }

  private loadCurrentUserFromStorage() {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  private ensureOwnerExists() {
    const ownerExists = this.users().some(u => u.email.toLowerCase() === OWNER_EMAIL);
    if (!ownerExists) {
        const ownerUser: User = {
            id: this.nextUserId(),
            name: "The White Wolf",
            email: OWNER_EMAIL,
            password: "Mm@123456",
            role: "Owner"
        };
        this.users.update(users => [ownerUser, ...users]);
        this.nextUserId.update(id => id + 1);
    }
  }

  // Expose all users except the current one for management panels
  readonly allUsers = computed(() => this.users());
  
  readonly usersForManagement = computed(() => {
    const currentUser = this.currentUser();
    if (currentUser?.role === 'Owner') {
      return this.users().filter(u => u.id !== currentUser.id);
    }
    return [];
  });


  isAdmin = computed(() => {
    const user = this.currentUser();
    return !!user && (user.role === 'Admin' || user.role === 'Owner');
  });

  isOwner = computed(() => {
    const user = this.currentUser();
    return !!user && user.role === 'Owner';
  });

  login(email: string, password: string): { success: boolean; message: string } {
    const user = this.users().find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      this.currentUser.set(user);
      return { success: true, message: 'Login successful.' };
    }
    return { success: false, message: 'Invalid credentials.' };
  }

  logout(): void {
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  register(userData: Omit<User, 'id' | 'role'>): { success: boolean; message: string } {
    if (this.users().some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'Email is already registered.' };
    }
    
    // The first user to ever register becomes the Owner logic is removed.
    // All new registrations are Users.
    const role: UserRole = 'User';

    const newUser: User = {
      ...userData,
      id: this.nextUserId(),
      role: role
    };

    this.users.update(users => [...users, newUser]);
    this.nextUserId.update(id => id + 1);
    
    // Automatically log in the new user
    this.currentUser.set(newUser);
    
    return { success: true, message: 'Registration successful.' };
  }
  
  // --- User Management Methods (for Owner) ---

  promoteUser(userId: number): void {
    this.updateUserRole(userId, 'Admin');
  }

  demoteUser(userId: number): void {
    this.updateUserRole(userId, 'User');
  }

  private updateUserRole(userId: number, role: UserRole): void {
     if (!this.isOwner()) {
       console.error("Unauthorized role change attempt.");
       return;
     }
     this.users.update(users => {
        return users.map(user => 
            user.id === userId && user.role !== 'Owner' ? { ...user, role: role } : user
        );
     });
  }

  deleteUser(userId: number): void {
    if (!this.isOwner()) {
      console.error("Unauthorized user deletion attempt.");
      return;
    }
    this.users.update(users => users.filter(user => user.id !== userId && user.role !== 'Owner'));
  }
}
