import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemoLimitService {
  /** 'lists' | 'products' | null - when set, show limit message and reset button */
  limitReached = signal<'lists' | 'products' | null>(null);
  private hideTimeoutId: any;

  private scheduleAutoHide(): void {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
    }
    this.hideTimeoutId = setTimeout(() => {
      this.limitReached.set(null);
      this.hideTimeoutId = null;
    }, 5000);
  }

  showListsLimit(): void {
    this.limitReached.set('lists');
    this.scheduleAutoHide();
  }

  showProductsLimit(): void {
    this.limitReached.set('products');
    this.scheduleAutoHide();
  }

  dismiss(): void {
    this.limitReached.set(null);
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }
}
