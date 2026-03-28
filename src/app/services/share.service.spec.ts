import { TestBed } from '@angular/core/testing';
import { ShareService, isValidShareEmailFormat } from './share.service';
import { AuthService } from './auth.service';
import { ShoppingListService } from './shopping-list.service';
import { LocalStorageService } from './local-storage.service';

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
}

describe('isValidShareEmailFormat', () => {
  it('accepts typical emails', () => {
    expect(isValidShareEmailFormat('demo@test.pl')).toBeTrue();
    expect(isValidShareEmailFormat('  user.name+tag@example.com  ')).toBeTrue();
  });

  it('rejects non-emails', () => {
    expect(isValidShareEmailFormat('')).toBeFalse();
    expect(isValidShareEmailFormat('   ')).toBeFalse();
    expect(isValidShareEmailFormat('not-an-email')).toBeFalse();
    expect(isValidShareEmailFormat('missing-at-sign.pl')).toBeFalse();
    expect(isValidShareEmailFormat('@nodomain.com')).toBeFalse();
    expect(isValidShareEmailFormat('no-tld@foo')).toBeFalse();
  });
});

describe('ShareService', () => {
  let service: ShareService;
  let shoppingListService: ShoppingListService;
  let auth: jasmine.SpyObj<AuthService>;
  let storage: LocalStorageServiceMock;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser', 'isDemoUser']);
    auth.isDemoUser.and.returnValue(false);
    auth.getCurrentUser.and.returnValue({
      id: 'owner1',
      email: 'owner@test.pl',
      username: 'Owner',
      password: 'x',
      createdAt: new Date(),
    });

    TestBed.configureTestingModule({
      providers: [
        ShareService,
        ShoppingListService,
        { provide: LocalStorageService, useClass: LocalStorageServiceMock },
        { provide: AuthService, useValue: auth },
      ],
    });

    service = TestBed.inject(ShareService);
    shoppingListService = TestBed.inject(ShoppingListService);
    storage = TestBed.inject(LocalStorageService) as unknown as LocalStorageServiceMock;

    storage.setItem('users', [
      {
        id: 'other1',
        email: 'other@test.pl',
        username: 'Other',
        password: 'x',
        createdAt: new Date(),
      },
    ]);

    const created = shoppingListService.createList('L');
    expect(created.list).toBeTruthy();
    shoppingListService.updateList({
      ...created.list!,
      ownerId: 'owner1',
      sharedWith: [],
    });
  });

  it('returns demo-unavailable when email is valid (sharing disabled in demo)', () => {
    const list = shoppingListService.getActiveLists()[0];
    const result = service.shareList(list.id, 'other@test.pl');
    expect(result.success).toBeFalse();
    expect(result.error).toBe('share.error_demo_unavailable');
    const after = shoppingListService.getListById(list.id);
    expect(after!.sharedWith).toEqual([]);
  });

  it('returns invalid email before demo message', () => {
    const list = shoppingListService.getActiveLists()[0];
    const result = service.shareList(list.id, 'nope');
    expect(result.success).toBeFalse();
    expect(result.error).toBe('list.share_email_invalid');
  });

  it('returns required when email is empty after trim', () => {
    const list = shoppingListService.getActiveLists()[0];
    const result = service.shareList(list.id, '   ');
    expect(result.success).toBeFalse();
    expect(result.error).toBe('list.share_email_required');
  });
});
