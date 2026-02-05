import { Product } from './product.model';

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: Date;
  products: Product[];
  ownerId: string; // ID użytkownika, który utworzył listę
  sharedWith: string[]; // Lista emaili użytkowników, z którymi lista jest udostępniona
}

export interface SharedListAccess {
  listId: string;
  ownerEmail: string;
  sharedWithEmail: string;
  sharedAt: Date;
}
