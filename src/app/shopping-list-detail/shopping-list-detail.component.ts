import { Component, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping-list.model';
import { Product, ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { ShoppingListService } from '../services/shopping-list.service';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { ListPriceVisibilityService } from '../services/list-price-visibility.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { SwipePreventDirective } from '../directives/swipe-prevent.directive';
import { IconPlusComponent } from '../shared/icons/icon-plus.component';

type SortOption = 'name' | 'category' | 'priority' | 'purchased' | 'custom';

@Component({
  selector: 'app-shopping-list-detail',
  imports: [CommonModule, RouterModule, FormsModule, SwipePreventDirective, TranslatePipe, IconPlusComponent],
  templateUrl: './shopping-list-detail.component.html',
  styleUrls: ['./shopping-list-detail.component.css', './shopping-list-detail-overlays.component.css']
})
export class ShoppingListDetailComponent implements OnInit {
  @ViewChild('listSearchInput') listSearchInput?: ElementRef<HTMLInputElement>;
  list = signal<ShoppingList | null>(null);
  editingProduct = signal<Product | null>(null);
  sortBy = signal<SortOption>('category');
  listSearchQuery = signal('');

  sortOptions: SortOption[] = [
    'category',
    'name',
    // 'custom', // Temporarily disabled — revisit later
    'priority',
    'purchased'
  ];
  priorities = Object.values(ProductPriority);
  categories = Object.values(ProductCategory);
  quantityUnits: { value: string; label: string }[] = [
    { value: 'szt', label: 'szt.' },
    { value: 'g', label: 'g' },
    { value: 'kg', label: 'kg' },
    { value: 'ml', label: 'ml' },
    { value: 'l', label: 'l' }
  ];
  defaultQuantityUnit = 'szt';

  shareEmail = '';
  showShareForm = signal(false);
  shareError = signal<string | null>(null);
  showOptionsMenu = signal(false);
  showSortSheet = signal(false);
  /** When false, the purchased (checked) section is collapsed. */
  purchasedSectionExpanded = signal(true);

  private touchStartX = 0;
  private touchCurrentX = 0;
  private touchProductId: string | null = null;
  private pointerProductId: string | null = null;
  swipedProductId: string | null = null;
  private swipeBaseX = 0;
  swipeDragX = signal(0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private shareService: ShareService,
    public authService: AuthService,
    public themeService: ThemeService,
    public priceVisibility: ListPriceVisibilityService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadList(id);
    }
  }

  loadList(id: string): void {
    const list = this.shoppingListService.getListById(id);
    if (!list) {
      this.router.navigate(['/']);
      return;
    }
    this.list.set(list);
  }

  togglePurchased(productId: string): void {
    const list = this.list();
    if (!list) return;

    this.shoppingListService.toggleProductPurchased(list.id, productId);
    this.loadList(list.id);
  }

  startEdit(product: Product): void {
    const copy = { ...product };
    if (copy.quantityUnit == null) copy.quantityUnit = this.defaultQuantityUnit;
    this.editingProduct.set(copy);
  }

  getQuantityDisplay(product: Product): string {
    const unit = product.quantityUnit ?? this.defaultQuantityUnit;
    return `${product.quantity} ${unit}`;
  }

  onEditingQuantityChange(value: number | string | null): void {
    const p = this.editingProduct();
    if (!p) return;
    const num = value === '' || value == null ? 0 : (typeof value === 'number' ? value : parseFloat(String(value)));
    const quantity = Number.isNaN(num) ? p.quantity : Math.max(0, num);
    this.editingProduct.set({ ...p, quantity });
  }

  cancelEdit(): void {
    this.editingProduct.set(null);
  }

  saveEdit(): void {
    const list = this.list();
    const product = this.editingProduct();
    if (!list || !product) return;

    this.shoppingListService.updateProductInList(list.id, product.id, product);
    this.editingProduct.set(null);
    this.loadList(list.id);
  }

  deleteProduct(productId: string): void {
    const list = this.list();
    if (!list) return;

    if (confirm(this.translate.get('confirm.delete_product'))) {
      this.shoppingListService.removeProductFromList(list.id, productId);
      this.loadList(list.id);
    }
  }

  getUserInitial(): string {
    const u = this.authService.getCurrentUser();
    if (!u) return '?';
    const s = (u.username || u.email || '?').trim();
    return s.charAt(0).toUpperCase() || '?';
  }

  getListProgressPercent(): number {
    const total = this.getTotalCount();
    if (total === 0) return 0;
    return Math.round((this.getPurchasedCount() / total) * 100);
  }

  togglePurchasedSection(): void {
    this.purchasedSectionExpanded.update(v => !v);
  }

  /** Filter list search only (no sort). */
  private getSearchFilteredProducts(): Product[] {
    const list = this.list();
    if (!list) return [];
    let products = [...list.products];
    const search = this.listSearchQuery().toLowerCase().trim();
    if (search) {
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          String(p.category || '').toLowerCase().includes(search) ||
          (p.note && p.note.toLowerCase().includes(search))
      );
    }
    return products;
  }

  private sortProductsSubset(products: Product[]): Product[] {
    const sort = this.sortBy();
    const effectiveSort: SortOption = sort === 'purchased' ? 'category' : sort;
    const copy = [...products];
    copy.sort((a, b) => {
      switch (effectiveSort) {
        case 'custom':
          return 0;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'priority': {
          const priorityOrder = { [ProductPriority.HIGH]: 3, [ProductPriority.MEDIUM]: 2, [ProductPriority.LOW]: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        default:
          return 0;
      }
    });
    return copy;
  }

  /** Not purchased — top section; always sorted within the group. */
  getFilteredActiveProducts(): Product[] {
    const products = this.getSearchFilteredProducts().filter(p => !p.isPurchased);
    return this.sortProductsSubset(products);
  }

  /** Purchased — bottom section; same sort within the group. */
  getFilteredCompletedProducts(): Product[] {
    const products = this.getSearchFilteredProducts().filter(p => p.isPurchased);
    return this.sortProductsSubset(products);
  }

  getFilteredProductCount(): number {
    return this.getSearchFilteredProducts().length;
  }

  /**
   * Active first, then completed (used by unit tests and legacy callers).
   */
  getFilteredAndSortedProducts(): Product[] {
    return [...this.getFilteredActiveProducts(), ...this.getFilteredCompletedProducts()];
  }

  openAddProductsPage(): void {
    const id = this.list()?.id;
    if (id) {
      void this.router.navigate(['/list', id, 'add']);
    }
  }

  getTotalPrice(): number {
    const list = this.list();
    if (!list) return 0;
    return list.products
      .filter(p => p.price && !p.isPurchased)
      .reduce((sum, p) => sum + (p.price! * p.quantity), 0);
  }

  getPurchasedCount(): number {
    const list = this.list();
    if (!list) return 0;
    return list.products.filter(p => p.isPurchased).length;
  }

  getTotalCount(): number {
    const list = this.list();
    if (!list) return 0;
    return list.products.length;
  }

  uncheckAllProducts(): void {
    const list = this.list();
    if (!list) return;

    if (confirm(this.translate.get('confirm.uncheck_all'))) {
      list.products.forEach(product => {
        if (product.isPurchased) {
          this.shoppingListService.updateProductInList(list.id, product.id, { isPurchased: false });
        }
      });
      this.loadList(list.id);
    }
  }

  isOwner(): boolean {
    const list = this.list();
    if (!list) return false;
    return this.shareService.isOwner(list.id);
  }

  canEdit(): boolean {
    const list = this.list();
    if (!list) return false;
    return this.shareService.canEditList(list.id);
  }

  shareList(): void {
    const list = this.list();
    if (!list) return;

    this.shareError.set(null);

    if (!this.shareEmail.trim()) {
      this.shareError.set('Podaj adres email');
      return;
    }

    const result = this.shareService.shareList(list.id, this.shareEmail);
    
    if (result.success) {
      this.shareEmail = '';
      this.showShareForm.set(false);
      this.loadList(list.id);
    } else {
      this.shareError.set(result.error || 'Błąd udostępniania');
    }
  }

  unshareList(email: string): void {
    const list = this.list();
    if (!list) return;

    if (confirm(`Czy na pewno chcesz cofnąć udostępnienie dla ${email}?`)) {
      this.shareService.unshareList(list.id, email);
      this.loadList(list.id);
    }
  }

  getSharedWith(): string[] {
    const list = this.list();
    if (!list) return [];
    return list.sharedWith || [];
  }

  getInitialFromEmail(email: string): string {
    if (!email) return '?';
    const namePart = email.split('@')[0] || email;
    return namePart.charAt(0).toUpperCase();
  }

  toggleOptionsMenu(): void {
    this.showOptionsMenu.set(!this.showOptionsMenu());
  }

  closeOptionsMenu(): void {
    this.showOptionsMenu.set(false);
  }

  openSortSheet(): void {
    this.showOptionsMenu.set(false);
    this.showSortSheet.set(true);
  }

  closeSortSheet(): void {
    this.showSortSheet.set(false);
  }

  backToOptionsFromSortSheet(): void {
    this.showSortSheet.set(false);
    this.showOptionsMenu.set(true);
  }

  selectSortFromSheet(option: SortOption): void {
    this.sortBy.set(option);
    this.showSortSheet.set(false);
  }

  focusListSearchFromMenu(): void {
    this.showOptionsMenu.set(false);
    setTimeout(() => this.listSearchInput?.nativeElement?.focus(), 10);
  }

  getCurrentSortLabel(): string {
    const current = this.sortBy();
    if (current === 'category') return 'Kategorie';
    if (current === 'name') return 'Alfabetycznie';
    if (current === 'custom') return 'Własne';
    if (current === 'priority') return this.translate.get('list.sort_priority');
    return this.translate.get('list.sort_status');
  }

  toggleShareForm(): void {
    if (!this.isOwner()) return;
    this.showShareForm.set(!this.showShareForm());
    this.showOptionsMenu.set(false);
  }

  openShareFromMenu(): void {
    if (!this.isOwner()) return;
    this.showOptionsMenu.set(false);
    this.showShareForm.set(true);
  }

  stopSharingFromMenu(): void {
    const list = this.list();
    if (!list || !this.isOwner()) return;
    if (!confirm('Czy na pewno chcesz przestać udostępniać tę listę?')) return;
    list.sharedWith = [];
    this.shoppingListService.updateList(list);
    this.loadList(list.id);
    this.showOptionsMenu.set(false);
  }

  renameList(): void {
    const list = this.list();
    if (!list) {
      return;
    }
    const currentName = list.name;
    const newName = prompt('Nowa nazwa listy:', currentName);
    if (!newName) {
      this.showOptionsMenu.set(false);
      return;
    }
    const trimmed = newName.trim();
    if (!trimmed || trimmed === currentName) {
      this.showOptionsMenu.set(false);
      return;
    }
    list.name = trimmed;
    this.shoppingListService.updateList(list);
    this.loadList(list.id);
    this.showOptionsMenu.set(false);
  }

  setSort(option: SortOption): void {
    this.sortBy.set(option);
    this.showOptionsMenu.set(false);
  }

  toggleThemeFromMenu(): void {
    this.themeService.toggleTheme();
    this.showOptionsMenu.set(false);
  }

  onShowPricesSwitchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.priceVisibility.setShowPrices(input.checked);
  }

  archiveList(): void {
    const list = this.list();
    if (!list || !this.isOwner()) return;
    this.shoppingListService.archiveList(list.id);
    this.showOptionsMenu.set(false);
    this.router.navigate(['/']);
  }

  unarchiveList(): void {
    const list = this.list();
    if (!list || !this.isOwner()) return;
    this.shoppingListService.unarchiveList(list.id);
    this.showOptionsMenu.set(false);
    this.loadList(list.id);
  }

  saveAsTemplate(): void {
    const list = this.list();
    if (!list || !this.isOwner()) return;
    const name = prompt(this.translate.get('template.name') + ':', list.name);
    if (!name?.trim()) {
      this.showOptionsMenu.set(false);
      return;
    }
    this.shoppingListService.saveTemplate(name.trim(), list);
    this.showOptionsMenu.set(false);
  }

  isListArchived(): boolean {
    return !!this.list()?.archived;
  }

  checkAllProducts(): void {
    const list = this.list();
    if (!list) return;

    list.products.forEach(product => {
      if (!product.isPurchased) {
        this.shoppingListService.updateProductInList(list.id, product.id, { isPurchased: true });
      }
    });
    this.loadList(list.id);
    this.showOptionsMenu.set(false);
  }

  removePurchasedProducts(): void {
    const list = this.list();
    if (!list) return;

    const purchasedCount = list.products.filter(p => p.isPurchased).length;
    if (purchasedCount === 0) {
      alert('Brak kupionych produktów do usunięcia.');
      this.showOptionsMenu.set(false);
      return;
    }

    if (!confirm(this.translate.get('confirm.remove_purchased'))) {
      return;
    }

    list.products = list.products.filter(p => !p.isPurchased);
    this.shoppingListService.updateList(list);
    this.loadList(list.id);
    this.showOptionsMenu.set(false);
  }

  onProductTap(product: Product): void {
    // If another row is swiped open for delete, collapse it first
    if (this.swipedProductId && this.swipedProductId !== product.id) {
      this.swipedProductId = null;
      return;
    }

    // If this product row is swiped open, collapse instead of opening edit
    if (this.swipedProductId === product.id) {
      this.swipedProductId = null;
      return;
    }

    this.startEdit(product);
  }

  onCheckboxClick(event: Event): void {
    event.stopPropagation();
  }

  onTouchStart(event: TouchEvent, productId: string): void {
    if (event.touches.length !== 1) return;
    this.touchStartX = event.touches[0].clientX;
    this.touchCurrentX = this.touchStartX;
    this.touchProductId = productId;
    this.swipeBaseX = this.swipedProductId === productId ? -80 : 0;
    this.swipeDragX.set(this.swipeBaseX);
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.touchProductId || event.touches.length !== 1) return;
    this.touchCurrentX = event.touches[0].clientX;

    const delta = this.touchCurrentX - this.touchStartX;
    const next = Math.max(-80, Math.min(0, this.swipeBaseX + delta));
    this.swipeDragX.set(next);

    if (Math.abs(delta) > 10) {
      event.preventDefault();
    }
  }

  onTouchEnd(): void {
    if (!this.touchProductId) {
      this.resetTouch();
      return;
    }
    this.applySwipeEnd(this.touchProductId);
    this.resetTouch();
  }

  onPointerDown(event: PointerEvent, productId: string): void {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'touch') return;
    if (event.pointerType === 'touch') return;
    (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId);
    this.touchStartX = event.clientX;
    this.touchCurrentX = event.clientX;
    this.touchProductId = productId;
    this.pointerProductId = productId;
    this.swipeBaseX = this.swipedProductId === productId ? -80 : 0;
    this.swipeDragX.set(this.swipeBaseX);
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.pointerProductId || this.touchProductId !== this.pointerProductId) return;
    this.touchCurrentX = event.clientX;
    const delta = this.touchCurrentX - this.touchStartX;
    const next = Math.max(-80, Math.min(0, this.swipeBaseX + delta));
    this.swipeDragX.set(next);
  }

  onPointerUp(): void {
    if (!this.pointerProductId) return;
    this.applySwipeEnd(this.pointerProductId);
    this.pointerProductId = null;
    this.resetTouch();
  }

  private applySwipeEnd(productId: string): void {
    const finalX = this.swipeDragX();
    const openThreshold = -40;
    const closeThreshold = -20;

    if (finalX <= openThreshold) {
      this.swipedProductId = productId;
      this.swipeDragX.set(-80);
    } else if (finalX >= closeThreshold) {
      this.swipedProductId = null;
      this.swipeDragX.set(0);
    } else {
      if (finalX < -40) {
        this.swipedProductId = productId;
        this.swipeDragX.set(-80);
      } else {
        this.swipedProductId = null;
        this.swipeDragX.set(0);
      }
    }
  }

  private resetTouch(): void {
    this.touchStartX = 0;
    this.touchCurrentX = 0;
    this.touchProductId = null;
    this.swipeBaseX = 0;
  }

  getSwipeTransform(productId: string): string {
    if (this.touchProductId === productId) {
      return `translateX(${this.swipeDragX()}px)`;
    }
    if (this.swipedProductId === productId) {
      return 'translateX(-80px)';
    }
    return 'translateX(0px)';
  }
}
