import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

const STORAGE_KEY = 'list_show_prices';

/**
 * Globalne ustawienie: czy na liście zakupów pokazywać ceny produktów i sumę.
 * Domyślnie wyłączone — użytkownik włącza w menu (stan w localStorage).
 */
@Injectable({ providedIn: 'root' })
export class ListPriceVisibilityService {
  private readonly _showPrices = signal(false);

  /** Gdy false — ukryj ceny w wierszach listy i szacowany koszt (edycja: pole ceny zostaje). */
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
