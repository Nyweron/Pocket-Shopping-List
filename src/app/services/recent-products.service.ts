import { Injectable } from '@angular/core';
import { ProductCategory } from '../models/product-category.enum';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'recent_product_refs';
const MAX_RECENT = 40;

export type RecentProductRef =
  | { type: 'catalog'; id: string }
  | { type: 'custom'; name: string; category: ProductCategory };

@Injectable({
  providedIn: 'root'
})
export class RecentProductsService {
  constructor(private productService: ProductService) {}

  recordCatalog(catalogProductId: string): void {
    const refs = this.load();
    const next = [{ type: 'catalog' as const, id: catalogProductId }, ...refs.filter(r => !(r.type === 'catalog' && r.id === catalogProductId))];
    this.save(next.slice(0, MAX_RECENT));
  }

  recordCustom(name: string, category: ProductCategory): void {
    const key = name.toLowerCase().trim();
    const refs = this.load();
    const filtered = refs.filter(
      r => !(r.type === 'custom' && r.name.toLowerCase().trim() === key && r.category === category)
    );
    const next = [{ type: 'custom' as const, name: name.trim(), category }, ...filtered];
    this.save(next.slice(0, MAX_RECENT));
  }

  /** Resolved products for “Ostatnie” (unknown catalog ids skipped). */
  getRecentProducts(): Product[] {
    const out: Product[] = [];
    const seen = new Set<string>();
    for (const ref of this.load()) {
      if (ref.type === 'catalog') {
        const p = this.productService.getProductById(ref.id);
        if (!p) continue;
        const key = `c:${p.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ ...p });
      } else {
        const key = `n:${ref.name.toLowerCase()}|${ref.category}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(
          this.productService.createCustomProduct(ref.name, ref.category)
        );
      }
    }
    return out;
  }

  private load(): RecentProductRef[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as RecentProductRef[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private save(refs: RecentProductRef[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(refs));
  }
}
