import { Injectable } from '@angular/core';
import { Product, ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'user_products';
  private defaultProducts: Product[] = [
    // Owoce i warzywa
    { id: '1', name: 'Jabłka', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '2', name: 'Banan', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '3', name: 'Pomidory', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '4', name: 'Ogórki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '5', name: 'Marchew', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '6', name: 'Cebula', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '7', name: 'Ziemniaki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '8', name: 'Papryka', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '9', name: 'Sałata', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '10', name: 'Cytryny', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Nabiał
    { id: '11', name: 'Mleko', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '12', name: 'Jajka', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '13', name: 'Masło', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '14', name: 'Ser żółty', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '15', name: 'Ser biały', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '16', name: 'Jogurt', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '17', name: 'Śmietana', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '18', name: 'Twaróg', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Mięso i wędliny
    { id: '19', name: 'Kurczak', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '20', name: 'Wołowina', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '21', name: 'Wieprzowina', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '22', name: 'Szynka', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '23', name: 'Kiełbasa', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '24', name: 'Boczek', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Pieczywo
    { id: '25', name: 'Chleb', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '26', name: 'Bułki', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '27', name: 'Bagietka', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Produkty sypkie
    { id: '28', name: 'Mąka', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '29', name: 'Cukier', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '30', name: 'Ryż', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '31', name: 'Makaron', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '32', name: 'Płatki owsiane', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '33', name: 'Kasza', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Napoje
    { id: '34', name: 'Woda', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '35', name: 'Sok', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '36', name: 'Kawa', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '37', name: 'Herbata', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '38', name: 'Piwo', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Słodycze
    { id: '39', name: 'Czekolada', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '40', name: 'Ciastka', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '41', name: 'Lody', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Chemia gospodarcza
    { id: '42', name: 'Proszek do prania', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '43', name: 'Płyn do mycia naczyń', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '44', name: 'Papier toaletowy', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '45', name: 'Środki czystości', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '46', name: 'Worki na śmieci', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Inne
    { id: '47', name: 'Olej', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '48', name: 'Ocet', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '49', name: 'Sól', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '50', name: 'Pieprz', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false }
  ];

  constructor() {}

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      return [];
    }
    
    const allProducts = this.getAllProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery)
    );
  }

  getAllProducts(): Product[] {
    return [...this.defaultProducts];
  }

  getProductById(id: string): Product | undefined {
    return this.defaultProducts.find(p => p.id === id);
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.defaultProducts.filter(p => p.category === category);
  }

  createCustomProduct(name: string, category: ProductCategory): Product {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      name,
      category,
      quantity: 1,
      priority: ProductPriority.MEDIUM,
      isPurchased: false,
      isCustom: true
    };
  }
}

