import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingList } from '../models/shopping-list.model';
import { ListTemplate } from '../models/shopping-list.model';
import { ShoppingListService } from '../services/shopping-list.service';
import { ShareService } from '../services/share.service';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';
import { DemoLimitService } from '../services/demo-limit.service';
import { RefreshListsService } from '../services/refresh-lists.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-shopping-lists',
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './shopping-lists.component.html',
  styleUrl: './shopping-lists.component.css'
})
export class ShoppingListsComponent implements OnInit {
  myLists = signal<ShoppingList[]>([]);
  sharedLists = signal<ShoppingList[]>([]);
  archivedLists = signal<ShoppingList[]>([]);
  newListName = '';
  showCreateForm = signal(false);
  showTemplatePicker = signal(false);
  activeTab = signal<'my' | 'shared' | 'archive'>('my');
  templates = signal<ListTemplate[]>([]);

  constructor(
    private shoppingListService: ShoppingListService,
    private shareService: ShareService,
    public authService: AuthService,
    public themeService: ThemeService,
    private demoLimit: DemoLimitService,
    private refreshLists: RefreshListsService,
    public translate: TranslateService
  ) {
    effect(() => {
      this.refreshLists.trigger();
      this.loadLists();
    });
  }

  ngOnInit(): void {
    this.loadLists();
    this.templates.set(this.shoppingListService.getTemplates());
  }

  loadLists(): void {
    if (this.authService.isAuthenticated()) {
      this.myLists.set(this.shareService.getMyLists());
      this.sharedLists.set(this.shareService.getSharedListsForUser());
      this.archivedLists.set(this.shareService.getMyArchivedLists());
    } else {
      this.myLists.set(this.shoppingListService.getActiveLists());
      this.sharedLists.set([]);
      this.archivedLists.set([]);
    }
  }

  createList(): void {
    if (this.newListName.trim().length === 0) return;
    const result = this.shoppingListService.createList(this.newListName.trim());
    if (result.error) {
      this.demoLimit.showListsLimit();
      return;
    }
    this.newListName = '';
    this.showCreateForm.set(false);
    this.loadLists();
  }

  createListFromTemplate(templateId: string, name: string): void {
    const listName = name?.trim() || undefined;
    const list = this.shoppingListService.createListFromTemplate(templateId, listName || '');
    if (list) {
      this.showTemplatePicker.set(false);
      this.loadLists();
    }
  }

  openTemplatePicker(): void {
    this.templates.set(this.shoppingListService.getTemplates());
    this.showTemplatePicker.set(true);
  }

  deleteList(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm(this.translate.get('confirm.delete_list'))) {
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
    const tab = this.activeTab();
    if (tab === 'my') return this.myLists();
    if (tab === 'shared') return this.sharedLists();
    return this.archivedLists();
  }

  isSharedList(list: ShoppingList): boolean {
    return this.sharedLists().some(l => l.id === list.id);
  }

  unarchiveList(id: string): void {
    this.shoppingListService.unarchiveList(id);
    this.loadLists();
  }
}
