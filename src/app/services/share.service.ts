import { Injectable } from '@angular/core';
import { ShoppingList, SharedListAccess } from '../models/shopping-list.model';
import { AuthService } from './auth.service';
import { ShoppingListService } from './shopping-list.service';
import { LocalStorageService } from './local-storage.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private readonly SHARED_ACCESS_KEY = 'shared_list_access';

  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService,
    private localStorageService: LocalStorageService
  ) {}

  shareList(listId: string, email: string): { success: boolean; error?: string } {
    const list = this.shoppingListService.getListById(listId);
    if (!list) {
      return { success: false, error: 'Lista nie istnieje' };
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Musisz być zalogowany' };
    }

    if (list.ownerId !== currentUser.id) {
      return { success: false, error: 'Możesz udostępniać tylko swoje listy' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    if (normalizedEmail === currentUser.email.toLowerCase()) {
      return { success: false, error: 'Nie możesz udostępnić listy samemu sobie' };
    }

    if (list.sharedWith.includes(normalizedEmail)) {
      return { success: false, error: 'Lista jest już udostępniona temu użytkownikowi' };
    }

    // Target user must exist
    const allUsers = this.getAllUsers();
    const targetUser = allUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!targetUser) {
      return { success: false, error: 'Użytkownik o podanym emailu nie istnieje' };
    }

    // Append to shared-with list on the list
    list.sharedWith.push(normalizedEmail);
    this.shoppingListService.updateList(list);

    // Persist share metadata
    const access: SharedListAccess = {
      listId: list.id,
      ownerEmail: currentUser.email,
      sharedWithEmail: normalizedEmail,
      sharedAt: new Date()
    };

    const allAccess = this.getAllSharedAccess();
    allAccess.push(access);
    this.saveSharedAccess(allAccess);

    return { success: true };
  }

  unshareList(listId: string, email: string): void {
    const list = this.shoppingListService.getListById(listId);
    if (!list) return;

    const normalizedEmail = email.toLowerCase().trim();
    list.sharedWith = list.sharedWith.filter(e => e !== normalizedEmail);
    this.shoppingListService.updateList(list);

    // Remove from shared-with list
    const allAccess = this.getAllSharedAccess();
    const filtered = allAccess.filter(
      a => !(a.listId === listId && a.sharedWithEmail === normalizedEmail)
    );
    this.saveSharedAccess(filtered);
  }

  getSharedListsForUser(): ShoppingList[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    const allLists = this.shoppingListService.getActiveLists();
    return allLists.filter(list =>
      list.sharedWith.includes(currentUser.email.toLowerCase())
    );
  }

  getMyLists(): ShoppingList[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    const allLists = this.shoppingListService.getActiveLists();
    return allLists.filter(list => list.ownerId === currentUser.id);
  }

  getMyArchivedLists(): ShoppingList[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];
    return this.shoppingListService.getArchivedLists().filter(list => list.ownerId === currentUser.id);
  }

  canEditList(listId: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const list = this.shoppingListService.getListById(listId);
    if (!list) return false;

    // Can edit if owner or list is shared with current user
    return list.ownerId === currentUser.id || 
           list.sharedWith.includes(currentUser.email.toLowerCase());
  }

  isOwner(listId: string): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const list = this.shoppingListService.getListById(listId);
    if (!list) return false;

    return list.ownerId === currentUser.id;
  }

  private getAllUsers(): User[] {
    // Use LocalStorageService directly to read the full users collection
    const users = this.localStorageService.getItem<User[]>('users');
    if (!users) {
      return [];
    }
    return users.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  }

  private getAllSharedAccess(): SharedListAccess[] {
    const access = this.localStorageService.getItem<SharedListAccess[]>(this.SHARED_ACCESS_KEY);
    if (!access) {
      return [];
    }
    return access.map(a => ({
      ...a,
      sharedAt: new Date(a.sharedAt)
    }));
  }

  private saveSharedAccess(access: SharedListAccess[]): void {
    this.localStorageService.setItem(this.SHARED_ACCESS_KEY, access);
  }
}

