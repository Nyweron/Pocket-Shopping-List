import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, provideRouter, Routes } from '@angular/router';
import { ShoppingListDetailComponent } from './shopping-list-detail.component';
import { ShoppingListService } from '../services/shopping-list.service';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ListPriceVisibilityService } from '../services/list-price-visibility.service';
import { TranslateService } from '../services/translate.service';
import { UiDialogService } from '../services/ui-dialog.service';
import { ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';

@Component({ standalone: true, template: '' })
class RouterStubComponent {}

const detailTestRoutes: Routes = [
  { path: 'profile', component: RouterStubComponent },
  { path: '**', component: RouterStubComponent },
];

describe('ShoppingListDetailComponent', () => {
  let component: ShoppingListDetailComponent;
  let fixture: any;
  let shoppingListService: jasmine.SpyObj<ShoppingListService>;
  let shareService: jasmine.SpyObj<ShareService>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let authService: jasmine.SpyObj<AuthService>;
  let uiDialog: jasmine.SpyObj<UiDialogService>;

  const baseList = {
    id: 'l1',
    name: 'List',
    createdAt: new Date(),
    ownerId: 'u1',
    sharedWith: ['x@test.pl'],
    products: [
      {
        id: 'p1',
        name: 'Milk',
        category: ProductCategory.DAIRY,
        quantity: 1,
        priority: ProductPriority.HIGH,
        isPurchased: false,
        price: 5,
        note: 'cold',
      },
      {
        id: 'p2',
        name: 'Apple',
        category: ProductCategory.FRUITS_VEGETABLES,
        quantity: 2,
        priority: ProductPriority.LOW,
        isPurchased: true,
        price: 3,
        note: 'green',
      },
    ],
  };

  beforeEach(async () => {
    shoppingListService = jasmine.createSpyObj<ShoppingListService>('ShoppingListService', [
      'getListById',
      'addProductToList',
      'toggleProductPurchased',
      'updateProductInList',
      'removeProductFromList',
      'updateList',
      'archiveList',
      'unarchiveList',
      'saveTemplate',
    ]);
    shareService = jasmine.createSpyObj<ShareService>('ShareService', [
      'isOwner',
      'canEditList',
      'shareList',
      'unshareList',
    ]);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser']);
    themeService = jasmine.createSpyObj<ThemeService>('ThemeService', ['toggleTheme']);
    const priceVisibility = {
      showPrices: () => true,
      setShowPrices: (_v: boolean): void => {},
      toggleShowPrices: (): void => {},
    };
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['get', 'currentLang']);
    translate.currentLang.and.returnValue('pl');
    uiDialog = jasmine.createSpyObj<UiDialogService>('UiDialogService', ['confirm', 'alert']);
    uiDialog.confirm.and.returnValue(Promise.resolve(true));
    uiDialog.alert.and.returnValue(Promise.resolve());
    translate.get.and.callFake((k: string) => k);
    shoppingListService.getListById.and.returnValue(structuredClone(baseList) as any);
    shoppingListService.addProductToList.and.returnValue({ success: true });
    shareService.isOwner.and.returnValue(true);
    shareService.canEditList.and.returnValue(true);
    shareService.shareList.and.returnValue({ success: true });

    await TestBed.configureTestingModule({
      imports: [ShoppingListDetailComponent, RouterStubComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter(detailTestRoutes),
        { provide: ShoppingListService, useValue: shoppingListService },
        { provide: ShareService, useValue: shareService },
        { provide: AuthService, useValue: authService },
        { provide: ThemeService, useValue: themeService },
        { provide: ListPriceVisibilityService, useValue: priceVisibility },
        { provide: TranslateService, useValue: translate },
        { provide: UiDialogService, useValue: uiDialog },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => 'l1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListDetailComponent);
    component = fixture.componentInstance;
    component.list.set(structuredClone(baseList) as any);
  });

  it('header user avatar links to profile', () => {
    authService.getCurrentUser.and.returnValue({ id: 'u1', email: 'dan@test.pl', username: 'dan' } as any);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('[data-testid="header-profile-avatar"]') as HTMLAnchorElement | null;
    expect(link).not.toBeNull();
    expect(link!.tagName.toLowerCase()).toBe('a');
    expect(link!.getAttribute('href')).toContain('/profile');
    expect(link!.getAttribute('href')).toContain('listId=l1');
    expect(link!.textContent?.trim()).toBe('D');
  });

  it('filters and sorts products by search and sort mode', () => {
    component.listSearchQuery.set('milk');
    component.sortBy.set('name');
    const products = component.getFilteredAndSortedProducts();
    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Milk');

    component.listSearchQuery.set('');
    component.sortBy.set('category');
    const categorySorted = component.getFilteredAndSortedProducts();
    expect(categorySorted[0].category <= categorySorted[1].category).toBeTrue();
  });

  it('keeps active products on top and completed at bottom', () => {
    const active = component.getFilteredActiveProducts();
    const done = component.getFilteredCompletedProducts();
    expect(active.every(p => !p.isPurchased)).toBeTrue();
    expect(done.every(p => p.isPurchased)).toBeTrue();
    expect(active.map(p => p.id)).toEqual(['p1']);
    expect(done.map(p => p.id)).toEqual(['p2']);
  });

  it('toggles purchased section expanded flag', () => {
    component.purchasedSectionExpanded.set(false);
    component.togglePurchasedSection();
    expect(component.purchasedSectionExpanded()).toBeTrue();
  });

  it('togglePurchased collapses swipe-delete strip for that product', () => {
    component.swipedProductId = 'p1';
    component.togglePurchased('p1');
    expect(component.swipedProductId).toBeNull();
  });

  it('togglePurchased moves product between active and completed sections', () => {
    const store = structuredClone(baseList) as any;
    shoppingListService.getListById.and.callFake(() => structuredClone(store) as any);
    shoppingListService.toggleProductPurchased.and.callFake((_l: string, pid: string) => {
      const p = store.products.find((x: { id: string }) => x.id === pid);
      if (p) p.isPurchased = !p.isPurchased;
    });
    component.list.set(structuredClone(store) as any);

    expect(component.getFilteredActiveProducts().map(p => p.id)).toContain('p1');
    expect(component.getFilteredCompletedProducts().map(p => p.id)).not.toContain('p1');

    component.togglePurchased('p1');
    expect(component.getFilteredActiveProducts().map(p => p.id)).not.toContain('p1');
    expect(component.getFilteredCompletedProducts().map(p => p.id)).toContain('p1');

    component.togglePurchased('p1');
    expect(component.getFilteredActiveProducts().map(p => p.id)).toContain('p1');
    expect(component.getFilteredCompletedProducts().map(p => p.id)).not.toContain('p1');
  });

  it('handles edit flow and quantity changes', () => {
    const p = component.list()!.products[0] as any;
    component.startEdit(p);
    expect(component.editingProduct()?.id).toBe(p.id);

    component.onEditingQuantityChange('');
    expect(component.editingProduct()?.quantity).toBe(0);
    component.onEditingQuantityChange('abc');
    expect(component.editingProduct()?.quantity).toBe(0);
    component.onEditingQuantityChange(-10);
    expect(component.editingProduct()?.quantity).toBe(0);

    component.onEditingQuantityChange(3.5);
    component.saveEdit();
    expect(shoppingListService.updateProductInList).toHaveBeenCalled();
    expect(component.editingProduct()).toBeNull();
  });

  it('cancelEdit clears editing state', () => {
    component.startEdit(component.list()!.products[0] as any);
    component.cancelEdit();
    expect(component.editingProduct()).toBeNull();
  });

  it('computes counters and total price', () => {
    expect(component.getTotalCount()).toBe(2);
    expect(component.getPurchasedCount()).toBe(1);
    expect(component.getTotalPrice()).toBe(5);
  });

  it('checkAllProducts updates not purchased products', () => {
    component.checkAllProducts();
    expect(shoppingListService.updateProductInList).toHaveBeenCalled();
  });

  it('uncheckAllProducts uses confirm and updates purchased', async () => {
    await component.uncheckAllProducts();
    expect(uiDialog.confirm).toHaveBeenCalledWith('confirm.uncheck_all');
    expect(shoppingListService.updateProductInList).toHaveBeenCalled();
  });

  it('removePurchasedProducts alerts when zero purchased', async () => {
    const list = component.list()!;
    list.products.forEach(p => (p.isPurchased = false));
    component.list.set(list as any);

    await component.removePurchasedProducts();
    expect(uiDialog.alert).toHaveBeenCalledWith('alert.no_purchased_to_remove');
  });

  it('removePurchasedProducts removes when confirmed', async () => {
    await component.removePurchasedProducts();
    expect(uiDialog.confirm).toHaveBeenCalledWith('confirm.remove_purchased');
    expect(shoppingListService.updateList).toHaveBeenCalled();
  });

  it('returns ownership and edit permissions', () => {
    expect(component.isOwner()).toBeTrue();
    expect(component.canEdit()).toBeTrue();
  });

  it('toggles UI states', () => {
    component.toggleOptionsMenu();
    expect(component.showOptionsMenu()).toBeTrue();
    component.openSortSheet();
    expect(component.showSortSheet()).toBeTrue();
    expect(component.showOptionsMenu()).toBeFalse();
    component.closeSortSheet();
    expect(component.showSortSheet()).toBeFalse();
    component.toggleShareForm();
    expect(component.showShareForm()).toBeTrue();
  });
});
