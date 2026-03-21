import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping-list.model';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { ShoppingListService } from '../services/shopping-list.service';
import { ProductService } from '../services/product.service';
import { RecentProductsService } from '../services/recent-products.service';
import { ShareService } from '../services/share.service';
import { DemoLimitService } from '../services/demo-limit.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';

export type AddProductsTab = 'popular' | 'categories' | 'recent';

@Component({
  selector: 'app-add-products-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './add-products-page.component.html',
  styleUrl: './add-products-page.component.css'
})
export class AddProductsPageComponent implements OnInit {
  listId = '';
  list = signal<ShoppingList | null>(null);
  searchQuery = signal('');
  activeTab = signal<AddProductsTab>('popular');
  selectedCategory = signal<ProductCategory>(ProductCategory.FRUITS_VEGETABLES);

  categories = Object.values(ProductCategory);

  canEdit = signal(true);

  readonly searchResults = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return [] as Product[];
    }
    return this.productService.searchProducts(this.searchQuery());
  });

  readonly showCustomAddRow = computed(() => {
    const raw = this.searchQuery().trim();
    if (!raw) {
      return false;
    }
    const q = raw.toLowerCase();
    const hits = this.searchResults();
    const exact = hits.some(p => p.name.toLowerCase().trim() === q);
    return !exact;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private productService: ProductService,
    private recentProducts: RecentProductsService,
    private shareService: ShareService,
    private demoLimit: DemoLimitService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      void this.router.navigate(['/']);
      return;
    }
    this.listId = id;
    this.refreshList();
    this.canEdit.set(this.shareService.canEditList(id));
  }

  refreshList(): void {
    const l = this.shoppingListService.getListById(this.listId);
    if (!l) {
      void this.router.navigate(['/']);
      return;
    }
    this.list.set(l);
  }

  back(): void {
    void this.router.navigate(['/list', this.listId]);
  }

  setTab(tab: AddProductsTab): void {
    this.activeTab.set(tab);
  }

  lineState(template: Product): { onList: boolean; totalQty: number; allPurchased: boolean } {
    const list = this.list();
    if (!list) {
      return { onList: false, totalQty: 0, allPurchased: false };
    }
    const matches = this.matchingLines(list, template.name, template.category);
    const totalQty = matches.reduce((s, p) => s + p.quantity, 0);
    const onList = matches.length > 0;
    const allPurchased = onList && matches.every(p => p.isPurchased);
    return { onList, totalQty, allPurchased };
  }

  private matchingLines(list: ShoppingList, name: string, category: ProductCategory): Product[] {
    const n = name.toLowerCase().trim();
    return list.products.filter(p => p.name.toLowerCase().trim() === n && p.category === category);
  }

  popularRows(): Product[] {
    return this.productService.getPopularProducts();
  }

  categoryRows(): Product[] {
    return this.productService.getProductsByCategory(this.selectedCategory());
  }

  recentRows(): Product[] {
    return this.recentProducts.getRecentProducts();
  }

  currentTabRows(): Product[] {
    if (this.searchQuery().trim()) {
      return this.searchResults();
    }
    switch (this.activeTab()) {
      case 'popular':
        return this.popularRows();
      case 'categories':
        return this.categoryRows();
      case 'recent':
        return this.recentRows();
      default:
        return [];
    }
  }

  trackByProductId(_index: number, p: Product): string {
    return p.id;
  }

  trackByNameCategory(_index: number, p: Product): string {
    return `${p.name.toLowerCase()}|${p.category}`;
  }

  onAdd(template: Product, event?: Event): void {
    event?.stopPropagation();
    if (!this.canEdit()) {
      return;
    }
    const catalogId = this.productService.getProductById(template.id)?.id;
    const result = this.shoppingListService.addOrIncrementProduct(this.listId, {
      ...template,
      quantity: 1
    });
    if (!result.success && result.error === 'demo_limit_products') {
      this.demoLimit.showProductsLimit();
      return;
    }
    if (catalogId) {
      this.recentProducts.recordCatalog(catalogId);
    } else if (template.isCustom) {
      this.recentProducts.recordCustom(template.name, template.category);
    }
    this.refreshList();
  }

  onDecrement(template: Product, event?: Event): void {
    event?.stopPropagation();
    if (!this.canEdit()) {
      return;
    }
    this.shoppingListService.decrementMatchingProduct(this.listId, template.name, template.category);
    this.refreshList();
  }

  onRemoveAll(template: Product, event?: Event): void {
    event?.stopPropagation();
    if (!this.canEdit()) {
      return;
    }
    this.shoppingListService.removeAllMatchingProducts(this.listId, template.name, template.category);
    this.refreshList();
  }

  addCustomFromSearch(): void {
    const name = this.searchQuery().trim();
    if (!name || !this.canEdit()) {
      return;
    }
    const custom = this.productService.createCustomProduct(name, ProductCategory.OTHER);
    const result = this.shoppingListService.addOrIncrementProduct(this.listId, custom);
    if (!result.success && result.error === 'demo_limit_products') {
      this.demoLimit.showProductsLimit();
      return;
    }
    this.recentProducts.recordCustom(name, ProductCategory.OTHER);
    this.searchQuery.set('');
    this.refreshList();
  }
}
