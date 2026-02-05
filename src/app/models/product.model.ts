import { ProductCategory } from './product-category.enum';

export enum ProductPriority {
  HIGH = 'wysoki',
  MEDIUM = 'średni',
  LOW = 'niski'
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  price?: number;
  priority: ProductPriority;
  note?: string;
  isPurchased: boolean;
  isCustom?: boolean; // true jeśli dodany przez użytkownika
}

