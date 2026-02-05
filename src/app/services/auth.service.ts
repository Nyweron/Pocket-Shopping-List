import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, RegisterData } from '../models/user.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'current_user';
  
  currentUser = signal<User | null>(null);

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.initializeDemoUser();
    this.loadCurrentUser();
  }

  private initializeDemoUser(): void {
    const users = this.getAllUsers();
    
    // Sprawdź czy testowy użytkownik już istnieje
    const demoUserExists = users.some(u => u.email === 'demo@test.pl');
    
    if (!demoUserExists) {
      const demoUser: User = {
        id: 'demo_user_001',
        email: 'demo@test.pl',
        username: 'Demo User',
        password: 'demo123',
        createdAt: new Date()
      };
      
      users.push(demoUser);
      this.saveUsers(users);
    }
  }

  register(data: RegisterData): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    
    // Sprawdź czy email już istnieje
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email już jest zarejestrowany' };
    }

    // Sprawdź czy username już istnieje
    if (users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: 'Nazwa użytkownika już istnieje' };
    }

    const newUser: User = {
      id: this.generateId(),
      email: data.email.toLowerCase(),
      username: data.username,
      password: data.password, // W produkcji powinno być zahashowane
      createdAt: new Date()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    this.currentUser.set(newUser);
    this.saveCurrentUser(newUser);
    
    return { success: true };
  }

  login(credentials: LoginCredentials): { success: boolean; error?: string } {
    const users = this.getAllUsers();
    const user = users.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() &&
           u.password === credentials.password
    );

    if (!user) {
      return { success: false, error: 'Nieprawidłowy email lub hasło' };
    }

    this.currentUser.set(user);
    this.saveCurrentUser(user);
    
    return { success: true };
  }

  logout(): void {
    this.currentUser.set(null);
    this.localStorageService.removeItem(this.CURRENT_USER_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private getAllUsers(): User[] {
    const users = this.localStorageService.getItem<User[]>(this.USERS_KEY);
    if (!users) {
      return [];
    }
    return users.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  }

  private saveUsers(users: User[]): void {
    this.localStorageService.setItem(this.USERS_KEY, users);
  }

  private loadCurrentUser(): void {
    const user = this.localStorageService.getItem<User>(this.CURRENT_USER_KEY);
    if (user) {
      this.currentUser.set({
        ...user,
        createdAt: new Date(user.createdAt)
      });
    }
  }

  private saveCurrentUser(user: User): void {
    this.localStorageService.setItem(this.CURRENT_USER_KEY, user);
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

