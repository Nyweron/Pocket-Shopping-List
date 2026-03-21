import { Injectable } from '@angular/core';
import { ShoppingList, ListTemplate } from '../models/shopping-list.model';
import { Product, ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';

const DEMO_MAX_LISTS = 2;
const DEMO_MAX_PRODUCTS_PER_LIST = 10;

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly STORAGE_KEY = 'shopping_lists';
  private readonly TEMPLATES_KEY = 'list_templates';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  getAllLists(): ShoppingList[] {
    const lists = this.localStorageService.getItem<ShoppingList[]>(this.STORAGE_KEY);
    if (!lists) {
      return [];
    }
    // Parse dates from JSON and fill missing fields
    return lists.map(list => ({
      ...list,
      createdAt: new Date(list.createdAt),
      ownerId: list.ownerId || 'anonymous',
      sharedWith: list.sharedWith || [],
      products: list.products.map(product => ({
        ...product
      }))
    }));
  }

  getListById(id: string): ShoppingList | undefined {
    const lists = this.getAllLists();
    return lists.find(list => list.id === id);
  }

  getActiveLists(): ShoppingList[] {
    return this.getAllLists().filter(l => !l.archived);
  }

  getArchivedLists(): ShoppingList[] {
    return this.getAllLists().filter(l => !!l.archived);
  }

  createList(name: string): { list?: ShoppingList; error?: string } {
    if (this.authService.isDemoUser()) {
      const active = this.getActiveLists().filter(l => l.ownerId === this.authService.getCurrentUser()?.id);
      if (active.length >= DEMO_MAX_LISTS) {
        return { error: 'demo_limit_lists' };
      }
    }
    const currentUser = this.authService.getCurrentUser();
    const ownerId = currentUser?.id || 'anonymous';
    const newList: ShoppingList = {
      id: this.generateId(),
      name,
      createdAt: new Date(),
      products: [],
      ownerId,
      sharedWith: [],
      archived: false
    };
    const lists = this.getAllLists();
    lists.push(newList);
    this.saveLists(lists);
    return { list: newList };
  }

  archiveList(id: string): void {
    const list = this.getListById(id);
    if (!list) return;
    list.archived = true;
    list.archivedAt = new Date().toISOString();
    this.updateList(list);
  }

  unarchiveList(id: string): void {
    const list = this.getListById(id);
    if (!list) return;
    list.archived = false;
    list.archivedAt = undefined;
    this.updateList(list);
  }

  updateList(list: ShoppingList): void {
    const lists = this.getAllLists();
    const index = lists.findIndex(l => l.id === list.id);
    if (index !== -1) {
      lists[index] = list;
      this.saveLists(lists);
    }
  }

  deleteList(id: string): void {
    const lists = this.getAllLists();
    const filtered = lists.filter(list => list.id !== id);
    this.saveLists(filtered);
  }

  addProductToList(listId: string, product: Product): { success: boolean; error?: string } {
    const list = this.getListById(listId);
    if (!list) return { success: false };
    if (this.authService.isDemoUser() && list.products.length >= DEMO_MAX_PRODUCTS_PER_LIST) {
      return { success: false, error: 'demo_limit_products' };
    }
    const listProduct: Product = {
      ...product,
      id: `${product.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    list.products.push(listProduct);
    this.updateList(list);
    return { success: true };
  }

  updateProductInList(listId: string, productId: string, updates: Partial<Product>): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }

    const productIndex = list.products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      list.products[productIndex] = { ...list.products[productIndex], ...updates };
      this.updateList(list);
    }
  }

  removeProductFromList(listId: string, productId: string): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }

    list.products = list.products.filter(p => p.id !== productId);
    this.updateList(list);
  }

  /**
   * Adds a product or increments quantity on a matching line (same name + category, case-insensitive).
   * Prefers the first not-yet-purchased line; if every matching line is purchased, adds a new line (next trip).
   */
  addOrIncrementProduct(listId: string, template: Product): { success: boolean; error?: string } {
    const list = this.getListById(listId);
    if (!list) {
      return { success: false };
    }
    const nameKey = template.name.toLowerCase().trim();
    const matches = list.products.filter(
      p => p.name.toLowerCase().trim() === nameKey && p.category === template.category
    );
    if (matches.length === 0) {
      return this.addProductToList(listId, { ...template, quantity: template.quantity ?? 1 });
    }
    const delta = template.quantity ?? 1;
    const unpurchased = matches.filter(p => !p.isPurchased);
    if (unpurchased.length === 0) {
      return this.addProductToList(listId, {
        ...template,
        quantity: delta,
        isPurchased: false
      });
    }
    const target = unpurchased[0];
    this.updateProductInList(listId, target.id, { quantity: target.quantity + delta });
    return { success: true };
  }

  /** Decrements quantity on the last matching line, or removes that line if quantity would go below 1. */
  decrementMatchingProduct(listId: string, name: string, category: ProductCategory): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }
    const nameKey = name.toLowerCase().trim();
    const matches = list.products.filter(
      p => p.name.toLowerCase().trim() === nameKey && p.category === category
    );
    if (matches.length === 0) {
      return;
    }
    const last = matches[matches.length - 1];
    if (last.quantity > 1) {
      this.updateProductInList(listId, last.id, { quantity: last.quantity - 1 });
    } else {
      this.removeProductFromList(listId, last.id);
    }
  }

  /** Removes all list lines that match name + category (case-insensitive name). */
  removeAllMatchingProducts(listId: string, name: string, category: ProductCategory): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }
    const nameKey = name.toLowerCase().trim();
    list.products = list.products.filter(
      p => !(p.name.toLowerCase().trim() === nameKey && p.category === category)
    );
    this.updateList(list);
  }

  toggleProductPurchased(listId: string, productId: string): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }

    const product = list.products.find(p => p.id === productId);
    if (product) {
      product.isPurchased = !product.isPurchased;
      this.updateList(list);
    }
  }

  private saveLists(lists: ShoppingList[]): void {
    this.localStorageService.setItem(this.STORAGE_KEY, lists);
  }

  private generateId(): string {
    return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getTemplates(): ListTemplate[] {
    const t = this.localStorageService.getItem<ListTemplate[]>(this.TEMPLATES_KEY);
    return t ?? [];
  }

  saveTemplate(name: string, list: ShoppingList): ListTemplate {
    const template: ListTemplate = {
      id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      createdAt: new Date().toISOString(),
      products: list.products.map(p => ({
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        quantityUnit: p.quantityUnit,
        priority: p.priority
      }))
    };
    const all = this.getTemplates();
    all.push(template);
    this.localStorageService.setItem(this.TEMPLATES_KEY, all);
    return template;
  }

  createListFromTemplate(templateId: string, listName: string): ShoppingList | null {
    const template = this.getTemplates().find(t => t.id === templateId);
    if (!template) return null;
    const result = this.createList(listName || template.name);
    if (result.error || !result.list) return null;
    const list = result.list;
    const priorityMap: Record<string, ProductPriority> = {
      [ProductPriority.HIGH]: ProductPriority.HIGH,
      [ProductPriority.MEDIUM]: ProductPriority.MEDIUM,
      [ProductPriority.LOW]: ProductPriority.LOW
    };
    for (const p of template.products) {
      const prod: Product = {
        id: `tpl_${p.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: p.name,
        category: p.category as ProductCategory,
        quantity: p.quantity,
        quantityUnit: p.quantityUnit,
        priority: priorityMap[p.priority] ?? ProductPriority.MEDIUM,
        isPurchased: false
      };
      this.addProductToList(list.id, prod);
    }
    return this.getListById(list.id) ?? null;
  }

  deleteTemplate(id: string): void {
    const all = this.getTemplates().filter(t => t.id !== id);
    this.localStorageService.setItem(this.TEMPLATES_KEY, all);
  }
}

