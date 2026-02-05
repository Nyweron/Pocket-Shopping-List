import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly STORAGE_KEY_PREFIX = 'shopping_app_';

  constructor() {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage is not available');
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      const fullKey = this.STORAGE_KEY_PREFIX + key;
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
    } catch (error) {
      console.error('Error saving to localStorage', error);
      throw error;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const fullKey = this.STORAGE_KEY_PREFIX + key;
      const item = localStorage.getItem(fullKey);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      const fullKey = this.STORAGE_KEY_PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}

