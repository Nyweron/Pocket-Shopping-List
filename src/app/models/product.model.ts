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
  quantityUnit?: string; // e.g. 'szt', 'g', 'kg', 'ml', 'l'
  price?: number;
  priority: ProductPriority;
  note?: string;
  isPurchased: boolean;
  isCustom?: boolean; // true if user-added (custom product)
}

