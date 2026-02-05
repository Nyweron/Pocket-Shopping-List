import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping-list.model';
import { Product, ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { ShoppingListService } from '../services/shopping-list.service';
import { ProductSearchComponent } from '../product-search/product-search.component';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';

type SortOption = 'name' | 'category' | 'priority' | 'purchased';
type FilterOption = 'all' | 'purchased' | 'notPurchased';

@Component({
  selector: 'app-shopping-list-detail',
  imports: [CommonModule, RouterModule, FormsModule, ProductSearchComponent],
  templateUrl: './shopping-list-detail.component.html',
  styleUrl: './shopping-list-detail.component.css'
})
export class ShoppingListDetailComponent implements OnInit {
  list = signal<ShoppingList | null>(null);
  editingProduct = signal<Product | null>(null);
  sortBy = signal<SortOption>('name');
  filterBy = signal<FilterOption>('all');
  
  sortOptions: SortOption[] = ['name', 'category', 'priority', 'purchased'];
  filterOptions: FilterOption[] = ['all', 'purchased', 'notPurchased'];
  priorities = Object.values(ProductPriority);
  categories = Object.values(ProductCategory);

  shareEmail = '';
  showShareForm = signal(false);
  shareError = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingListService: ShoppingListService,
    private shareService: ShareService,
    private authService: AuthService
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

  onProductSelected(product: Product): void {
    const list = this.list();
    if (!list) return;

    this.shoppingListService.addProductToList(list.id, product);
    this.loadList(list.id);
  }

  togglePurchased(productId: string): void {
    const list = this.list();
    if (!list) return;

    this.shoppingListService.toggleProductPurchased(list.id, productId);
    this.loadList(list.id);
  }

  startEdit(product: Product): void {
    this.editingProduct.set({ ...product });
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

    if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      this.shoppingListService.removeProductFromList(list.id, productId);
      this.loadList(list.id);
    }
  }

  getFilteredAndSortedProducts(): Product[] {
    const list = this.list();
    if (!list) return [];

    let products = [...list.products];

    // Filtrowanie
    const filter = this.filterBy();
    if (filter === 'purchased') {
      products = products.filter(p => p.isPurchased);
    } else if (filter === 'notPurchased') {
      products = products.filter(p => !p.isPurchased);
    }

    // Sortowanie
    const sort = this.sortBy();
    products.sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'priority':
          const priorityOrder = { [ProductPriority.HIGH]: 3, [ProductPriority.MEDIUM]: 2, [ProductPriority.LOW]: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'purchased':
          return a.isPurchased === b.isPurchased ? 0 : a.isPurchased ? 1 : -1;
        default:
          return 0;
      }
    });

    return products;
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

    if (confirm('Czy na pewno chcesz odznaczyć wszystkie produkty?')) {
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
}
