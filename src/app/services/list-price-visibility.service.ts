import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const STORAGE_KEY = 'list_show_prices';

/**
 * Global preference: whether to show per-item prices and estimated total on the list.
 * Default off; user toggles in the menu (persisted in localStorage).
 */
@Injectable({ providedIn: 'root' })
export class ListPriceVisibilityService {
  private readonly _showPrices = signal(false);

  /** When false, hide row prices and estimated total (edit form still has price field). */
  readonly showPrices = this._showPrices.asReadonly();

  constructor(private localStorage: LocalStorageService) {
    const raw = this.localStorage.getItem<boolean>(STORAGE_KEY);
    if (raw === true || raw === false) {
      this._showPrices.set(raw);
    }
  }

  setShowPrices(value: boolean): void {
    this._showPrices.set(value);
    this.localStorage.setItem(STORAGE_KEY, value);
  }

  toggleShowPrices(): void {
    this.setShowPrices(!this._showPrices());
  }
}
