import { TestBed } from '@angular/core/testing';
import { ShoppingListService } from './shopping-list.service';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';
import { ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';

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

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let storage: LocalStorageServiceMock;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser', 'isDemoUser']);
    auth.getCurrentUser.and.returnValue({ id: 'u1', email: 'u@test.pl' } as any);
    auth.isDemoUser.and.returnValue(false);

    TestBed.configureTestingModule({
      providers: [
        ShoppingListService,
        { provide: LocalStorageService, useClass: LocalStorageServiceMock },
        { provide: AuthService, useValue: auth },
      ],
    });

    service = TestBed.inject(ShoppingListService);
    storage = TestBed.inject(LocalStorageService) as unknown as LocalStorageServiceMock;
  });

  function createBaseList() {
    const result = service.createList('List A');
    expect(result.list).toBeTruthy();
    return result.list!;
  }

  it('createList sets ownerId from current user', () => {
    const result = service.createList('My list');
    expect(result.error).toBeUndefined();
    expect(result.list?.ownerId).toBe('u1');
  });

  it('createList enforces demo list limit', () => {
    auth.isDemoUser.and.returnValue(true);
    auth.getCurrentUser.and.returnValue({ id: 'demo_user_001', email: 'demo@test.pl' } as any);

    expect(service.createList('A').error).toBeUndefined();
    expect(service.createList('B').error).toBeUndefined();
    const third = service.createList('C');

    expect(third.error).toBe('demo_limit_lists');
  });

  it('addProductToList adds product with unique id', () => {
    const list = createBaseList();
    const product = {
      id: 'p1',
      name: 'Milk',
      category: ProductCategory.DAIRY,
      quantity: 1,
      priority: ProductPriority.MEDIUM,
      isPurchased: false,
    };

    const a = service.addProductToList(list.id, product as any);
    const b = service.addProductToList(list.id, product as any);
    const loaded = service.getListById(list.id)!;

    expect(a.success).toBeTrue();
    expect(b.success).toBeTrue();
    expect(loaded.products.length).toBe(2);
    expect(loaded.products[0].id).not.toBe(loaded.products[1].id);
  });

  it('addProductToList enforces demo product limit', () => {
    auth.isDemoUser.and.returnValue(true);
    const list = createBaseList();

    for (let i = 0; i < 10; i++) {
      const res = service.addProductToList(list.id, {
        id: `p${i}`,
        name: `P${i}`,
        category: ProductCategory.OTHER,
        quantity: 1,
        priority: ProductPriority.LOW,
        isPurchased: false,
      } as any);
      expect(res.success).toBeTrue();
    }

    const over = service.addProductToList(list.id, {
      id: 'overflow',
      name: 'Overflow',
      category: ProductCategory.OTHER,
      quantity: 1,
      priority: ProductPriority.LOW,
      isPurchased: false,
    } as any);
    expect(over.success).toBeFalse();
    expect(over.error).toBe('demo_limit_products');
  });

  it('updateProductInList updates only selected product', () => {
    const list = createBaseList();
    service.addProductToList(list.id, { id: 'a', name: 'A', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    service.addProductToList(list.id, { id: 'b', name: 'B', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    const loaded = service.getListById(list.id)!;
    const targetId = loaded.products[0].id;
    const untouchedId = loaded.products[1].id;

    service.updateProductInList(list.id, targetId, { name: 'A2' });
    const after = service.getListById(list.id)!;
    expect(after.products.find(p => p.id === targetId)?.name).toBe('A2');
    expect(after.products.find(p => p.id === untouchedId)?.name).toBe('B');
  });

  it('removeProductFromList removes by id', () => {
    const list = createBaseList();
    service.addProductToList(list.id, { id: 'a', name: 'A', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    const productId = service.getListById(list.id)!.products[0].id;

    service.removeProductFromList(list.id, productId);
    expect(service.getListById(list.id)!.products.length).toBe(0);
  });

  it('addOrIncrementProduct merges same name and category', () => {
    const list = createBaseList();
    const tpl = {
      id: 'cat1',
      name: 'Mleko',
      category: ProductCategory.DAIRY,
      quantity: 1,
      priority: ProductPriority.HIGH,
      isPurchased: false,
    } as any;
    expect(service.addOrIncrementProduct(list.id, tpl).success).toBeTrue();
    expect(service.addOrIncrementProduct(list.id, tpl).success).toBeTrue();
    const loaded = service.getListById(list.id)!;
    expect(loaded.products.length).toBe(1);
    expect(loaded.products[0].quantity).toBe(2);
  });

  it('addOrIncrementProduct adds a new line when all matching lines are purchased', () => {
    const list = createBaseList();
    service.addProductToList(list.id, {
      id: 'e',
      name: 'Jajka',
      category: ProductCategory.DAIRY,
      quantity: 1,
      priority: ProductPriority.HIGH,
      isPurchased: true,
    } as any);
    const tpl = {
      id: '12',
      name: 'Jajka',
      category: ProductCategory.DAIRY,
      quantity: 1,
      priority: ProductPriority.HIGH,
      isPurchased: false,
    } as any;
    expect(service.addOrIncrementProduct(list.id, tpl).success).toBeTrue();
    const loaded = service.getListById(list.id)!;
    expect(loaded.products.length).toBe(2);
    const fresh = loaded.products.find(p => !p.isPurchased);
    expect(fresh?.name).toBe('Jajka');
    expect(fresh?.quantity).toBe(1);
  });

  it('decrementMatchingProduct decreases quantity or removes line', () => {
    const list = createBaseList();
    service.addProductToList(list.id, {
      id: 'x',
      name: 'Woda',
      category: ProductCategory.BEVERAGES,
      quantity: 2,
      priority: ProductPriority.MEDIUM,
      isPurchased: false,
    } as any);
    service.decrementMatchingProduct(list.id, 'Woda', ProductCategory.BEVERAGES);
    expect(service.getListById(list.id)!.products[0].quantity).toBe(1);
    service.decrementMatchingProduct(list.id, 'Woda', ProductCategory.BEVERAGES);
    expect(service.getListById(list.id)!.products.length).toBe(0);
  });

  it('removeAllMatchingProducts removes all lines with same name and category', () => {
    const list = createBaseList();
    service.addProductToList(list.id, { id: 'a', name: 'X', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    service.addProductToList(list.id, { id: 'b', name: 'X', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    service.removeAllMatchingProducts(list.id, 'X', ProductCategory.OTHER);
    expect(service.getListById(list.id)!.products.length).toBe(0);
  });

  it('toggleProductPurchased switches state', () => {
    const list = createBaseList();
    service.addProductToList(list.id, { id: 'a', name: 'A', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false } as any);
    const productId = service.getListById(list.id)!.products[0].id;

    service.toggleProductPurchased(list.id, productId);
    expect(service.getListById(list.id)!.products[0].isPurchased).toBeTrue();
    service.toggleProductPurchased(list.id, productId);
    expect(service.getListById(list.id)!.products[0].isPurchased).toBeFalse();
  });

  it('archiveList and unarchiveList update archived fields', () => {
    const list = createBaseList();

    service.archiveList(list.id);
    const archived = service.getListById(list.id)!;
    expect(archived.archived).toBeTrue();
    expect(archived.archivedAt).toBeTruthy();

    service.unarchiveList(list.id);
    const unarchived = service.getListById(list.id)!;
    expect(unarchived.archived).toBeFalse();
    expect(unarchived.archivedAt).toBeUndefined();
  });

  it('template flow: save, create from template, delete', () => {
    const list = createBaseList();
    service.addProductToList(list.id, {
      id: 'a',
      name: 'Rice',
      category: ProductCategory.GRAINS,
      quantity: 2,
      quantityUnit: 'kg',
      priority: ProductPriority.HIGH,
      isPurchased: false,
    } as any);
    const source = service.getListById(list.id)!;

    const template = service.saveTemplate('My tpl', source);
    expect(service.getTemplates().length).toBe(1);

    const created = service.createListFromTemplate(template.id, 'From tpl');
    expect(created).toBeTruthy();
    expect(created!.products.length).toBe(1);
    expect(created!.products[0].name).toBe('Rice');

    service.deleteTemplate(template.id);
    expect(service.getTemplates().length).toBe(0);
  });

  it('template flow uses MEDIUM priority fallback for invalid values', () => {
    const badTemplate = {
      id: 'tpl_bad',
      name: 'Bad',
      createdAt: new Date().toISOString(),
      products: [
        { name: 'X', category: ProductCategory.OTHER, quantity: 1, priority: 'invalid', quantityUnit: 'szt' },
      ],
    };
    storage.setItem('list_templates', [badTemplate] as any);

    const created = service.createListFromTemplate('tpl_bad', 'X');
    expect(created).toBeTruthy();
    expect(created!.products[0].priority).toBe(ProductPriority.MEDIUM);
  });
});
