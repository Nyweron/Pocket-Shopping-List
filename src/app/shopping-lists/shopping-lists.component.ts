import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping-list.model';
import { ShoppingListService } from '../services/shopping-list.service';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-shopping-lists',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shopping-lists.component.html',
  styleUrl: './shopping-lists.component.css'
})
export class ShoppingListsComponent implements OnInit {
  myLists = signal<ShoppingList[]>([]);
  sharedLists = signal<ShoppingList[]>([]);
  newListName = '';
  showCreateForm = signal(false);
  activeTab = signal<'my' | 'shared'>('my');

  constructor(
    private shoppingListService: ShoppingListService,
    private shareService: ShareService,
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadLists();
  }

  loadLists(): void {
    if (this.authService.isAuthenticated()) {
      this.myLists.set(this.shareService.getMyLists());
      this.sharedLists.set(this.shareService.getSharedListsForUser());
    } else {
      // Dla niezalogowanych użytkowników pokazuj wszystkie listy
      this.myLists.set(this.shoppingListService.getAllLists());
      this.sharedLists.set([]);
    }
  }

  createList(): void {
    if (this.newListName.trim().length === 0) {
      return;
    }

    this.shoppingListService.createList(this.newListName.trim());
    this.newListName = '';
    this.showCreateForm.set(false);
    this.loadLists();
  }

  deleteList(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Czy na pewno chcesz usunąć tę listę?')) {
      this.shoppingListService.deleteList(id);
      this.loadLists();
    }
  }

  showCreateFormToggle(): void {
    this.showCreateForm.set(!this.showCreateForm());
  }

  cancelCreate(): void {
    this.newListName = '';
    this.showCreateForm.set(false);
  }

  getProductCount(list: ShoppingList): number {
    return list.products.length;
  }

  getPurchasedCount(list: ShoppingList): number {
    return list.products.filter(p => p.isPurchased).length;
  }

  getCurrentLists(): ShoppingList[] {
    return this.activeTab() === 'my' ? this.myLists() : this.sharedLists();
  }

  isSharedList(list: ShoppingList): boolean {
    return this.sharedLists().some(l => l.id === list.id);
  }
}
