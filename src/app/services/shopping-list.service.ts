import { Injectable } from '@angular/core';
import { ShoppingList } from '../models/shopping-list.model';
import { Product } from '../models/product.model';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly STORAGE_KEY = 'shopping_lists';

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  getAllLists(): ShoppingList[] {
    const lists = this.localStorageService.getItem<ShoppingList[]>(this.STORAGE_KEY);
    if (!lists) {
      return [];
    }
    // Konwersja dat z stringów na obiekty Date i uzupełnienie brakujących pól
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

  createList(name: string): ShoppingList {
    const currentUser = this.authService.getCurrentUser();
    const ownerId = currentUser?.id || 'anonymous';
    
    const newList: ShoppingList = {
      id: this.generateId(),
      name,
      createdAt: new Date(),
      products: [],
      ownerId,
      sharedWith: []
    };
    
    const lists = this.getAllLists();
    lists.push(newList);
    this.saveLists(lists);
    
    return newList;
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

  addProductToList(listId: string, product: Product): void {
    const list = this.getListById(listId);
    if (!list) {
      return;
    }

    // Tworzenie kopii produktu z unikalnym ID dla tej listy
    const listProduct: Product = {
      ...product,
      id: `${product.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    list.products.push(listProduct);
    this.updateList(list);
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
}

