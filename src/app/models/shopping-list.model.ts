import { Product } from './product.model';

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: Date;
  products: Product[];
  ownerId: string;
  sharedWith: string[];
  archived?: boolean;
  archivedAt?: string; // ISO date string
}

export interface ListTemplate {
  id: string;
  name: string;
  createdAt: string; // ISO
  products: { name: string; category: string; quantity: number; quantityUnit?: string; priority: string }[];
}

export interface SharedListAccess {
  listId: string;
  ownerEmail: string;
  sharedWithEmail: string;
  sharedAt: Date;
}
