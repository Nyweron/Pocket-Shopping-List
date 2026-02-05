import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  @Output() productSelected = new EventEmitter<Product>();
  
  searchQuery = '';
  searchResults = signal<Product[]>([]);
  showCustomForm = signal(false);
  customProductName = '';
  customProductCategory: ProductCategory = ProductCategory.OTHER;
  
  categories = Object.values(ProductCategory);

  constructor(private productService: ProductService) {}

  onSearchChange(): void {
    if (this.searchQuery.trim().length === 0) {
      this.searchResults.set([]);
      return;
    }

    const results = this.productService.searchProducts(this.searchQuery);
    this.searchResults.set(results);
  }

  selectProduct(product: Product): void {
    this.productSelected.emit({ ...product });
    this.searchQuery = '';
    this.searchResults.set([]);
  }

  showAddCustomForm(): void {
    this.showCustomForm.set(true);
  }

  addCustomProduct(): void {
    if (this.customProductName.trim().length === 0) {
      return;
    }

    const customProduct = this.productService.createCustomProduct(
      this.customProductName.trim(),
      this.customProductCategory
    );

    this.productSelected.emit(customProduct);
    this.customProductName = '';
    this.customProductCategory = ProductCategory.OTHER;
    this.showCustomForm.set(false);
  }

  cancelCustomProduct(): void {
    this.customProductName = '';
    this.customProductCategory = ProductCategory.OTHER;
    this.showCustomForm.set(false);
  }
}
