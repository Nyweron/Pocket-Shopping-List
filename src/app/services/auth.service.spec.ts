import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { RegisterData } from '../models/user.model';

class LocalStorageServiceMock {
  private store = new Map<string, unknown>();

  setItem<T>(key: string, value: T): void {
    this.store.set(key, JSON.parse(JSON.stringify(value)));
  }

  getItem<T>(key: string): T | null {
    if (!this.store.has(key)) return null;
    return this.store.get(key) as T;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let storage: LocalStorageServiceMock;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useClass: LocalStorageServiceMock },
      ],
    });
    service = TestBed.inject(AuthService);
    storage = TestBed.inject(LocalStorageService) as unknown as LocalStorageServiceMock;
  });

  describe('register', () => {
    const baseData: RegisterData = {
      email: 'user@test.pl',
      username: 'User1',
      password: 'pass123',
    };

    it('registers new user successfully', () => {
      const result = service.register(baseData);

      expect(result.success).toBeTrue();
      expect(service.getCurrentUser()?.email).toBe('user@test.pl');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('rejects duplicate email (case-insensitive)', () => {
      service.register(baseData);

      const result = service.register({
        email: 'USER@test.pl',
        username: 'OtherName',
        password: 'x',
      });

      expect(result.success).toBeFalse();
      expect(result.error).toBe('auth.error_email_taken');
    });

    it('rejects duplicate username', () => {
      service.register(baseData);

      const result = service.register({
        email: 'new@test.pl',
        username: 'user1',
        password: 'x',
      });

      expect(result.success).toBeFalse();
      expect(result.error).toBe('auth.error_username_taken');
    });
  });

  describe('login', () => {
    beforeEach(() => {
      service.register({
        email: 'abc@test.pl',
        username: 'abc',
        password: 'pass',
      });
      service.logout();
    });

    it('logs in with valid credentials', () => {
      const result = service.login({ email: 'ABC@test.pl', password: 'pass' });

      expect(result.success).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getCurrentUser()?.email).toBe('abc@test.pl');
    });

    it('returns error with invalid credentials', () => {
      const result = service.login({ email: 'abc@test.pl', password: 'wrong' });

      expect(result.success).toBeFalse();
      expect(result.error).toBe('auth.error_invalid_credentials');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('clears current user and removes current_user from storage', () => {
      service.register({
        email: 'abc@test.pl',
        username: 'abc',
        password: 'pass',
      });

      service.logout();

      expect(service.getCurrentUser()).toBeNull();
      expect(storage.getItem('current_user')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('initialization', () => {
    it('creates demo user only once', () => {
      const usersBefore = storage.getItem<any[]>('users') ?? [];
      const countBefore = usersBefore.filter(u => u.email === 'demo@test.pl').length;
      expect(countBefore).toBe(1);

      const secondInstance = TestBed.inject(AuthService);
      expect(secondInstance).toBeTruthy();

      const usersAfter = storage.getItem<any[]>('users') ?? [];
      const countAfter = usersAfter.filter(u => u.email === 'demo@test.pl').length;
      expect(countAfter).toBe(1);
    });
  });

  describe('utility methods', () => {
    it('isAuthenticated returns false when logged out and true when logged in', () => {
      expect(service.isAuthenticated()).toBeFalse();

      service.login({ email: 'demo@test.pl', password: 'demo123' });
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('isDemoUser returns true only for demo user', () => {
      expect(service.login({ email: 'demo@test.pl', password: 'demo123' }).success).toBeTrue();
      expect(service.isDemoUser()).toBeTrue();

      service.register({
        email: 'normal@test.pl',
        username: 'normal',
        password: 'pass',
      });
      expect(service.isDemoUser()).toBeFalse();
    });
  });
});
