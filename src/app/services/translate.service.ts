import { Injectable, signal, computed } from '@angular/core';
import {
  resolveCatalogProductIdForDisplay,
  CATALOG_PRODUCT_NAMES_EN,
  CATALOG_PRODUCT_NAMES_PL,
} from '../i18n/catalog-product-names';
import { ProductCategory } from '../models/product-category.enum';
import { ProductPriority } from '../models/product.model';

export type Lang = 'pl' | 'en';

const PRODUCT_CATEGORY_KEYS: Record<ProductCategory, string> = {
  [ProductCategory.FRUITS_VEGETABLES]: 'category.fruits_vegetables',
  [ProductCategory.DAIRY]: 'category.dairy',
  [ProductCategory.MEAT]: 'category.meat',
  [ProductCategory.BREAD]: 'category.bread',
  [ProductCategory.GRAINS]: 'category.grains',
  [ProductCategory.BEVERAGES]: 'category.beverages',
  [ProductCategory.SWEETS]: 'category.sweets',
  [ProductCategory.HOUSEHOLD]: 'category.household',
  [ProductCategory.OTHER]: 'category.other',
};

const PRODUCT_PRIORITY_KEYS: Record<ProductPriority, string> = {
  [ProductPriority.HIGH]: 'priority.high',
  [ProductPriority.MEDIUM]: 'priority.medium',
  [ProductPriority.LOW]: 'priority.low',
};

/** Stored product.category values (Polish enum strings) — for aggregations keyed by string. */
const STORED_CATEGORY_VALUES: ReadonlySet<string> = new Set<string>(Object.values(ProductCategory));

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  pl: {
    'app.title': 'Listy zakupów',
    'app.my_lists': 'Moje listy',
    'app.shared_lists': 'Udostępnione mi',
    'app.new_list': 'Nowa lista',
    'app.archive': 'Archiwum',
    'app.from_template': 'Z szablonu',
    'app.templates': 'Szablony',
    'app.save_template': 'Zapisz jako szablon',
    'app.stats': 'Statystyki',
    'app.profile': 'Profil',
    'app.login': 'Zaloguj się',
    'app.logout': 'Wyloguj',
    'app.theme_dark': 'Tryb ciemny',
    'app.theme_light': 'Tryb jasny',
    'app.empty_my_lists': 'Nie masz jeszcze żadnych list zakupów.',
    'app.empty_shared': 'Nie masz jeszcze żadnych udostępnionych list.',
    'app.create_first': 'Utwórz nową listę, aby zacząć!',
    'app.list_name': 'Nazwa listy',
    'app.create': 'Utwórz',
    'app.cancel': 'Anuluj',
    'dialog.ok': 'OK',
    'dialog.confirm': 'Potwierdź',
    'app.lang_switch_to_en': 'Przełącz na angielski',
    'app.lang_switch_to_pl': 'Przełącz na polski',
    'app.products': 'Produkty',
    'app.created': 'Utworzono',
    'app.shared_badge': 'Udostępnione',
    'app.delete_list': 'Usuń listę',
    'list.back': 'Wróć',
    'list.share': 'Udostępnij listę',
    'list.options': 'Opcje listy',
    'list.filter': 'Filtruj',
    'list.sort': 'Sortuj',
    'list.all': 'Wszystkie',
    'list.purchased': 'Kupione',
    'list.not_purchased': 'Nie kupione',
    'list.sort_name': 'Nazwa',
    'list.sort_category': 'Kategoria',
    'list.sort_priority': 'Priorytet',
    'list.sort_status': 'Status',
    'list.uncheck_all': 'Odhacz wszystkie',
    'list.search_products': 'Szukaj na liście...',
    'list.empty_products': 'Brak produktów w tej liście.',
    'list.add_products': 'Dodaj produkty — naciśnij przycisk „Dodaj” na dole ekranu.',
    'list.quantity': 'Ilość',
    'list.price': 'Cena',
    'list.note': 'Notatka',
    'list.save': 'Zapisz',
    'list.delete': 'Usuń',
    'list.edit': 'Edytuj',
    'list.theme': 'Motyw',
    'list.theme_dark': 'ciemny',
    'list.theme_light': 'jasny',
    'list.rename': 'Zmień nazwę listy',
    'list.check_all': 'Zaznacz wszystkie produkty',
    'list.uncheck_all_btn': 'Odhacz wszystkie produkty',
    'list.remove_purchased': 'Usuń kupione produkty',
    'list.show_prices': 'Pokaż ceny',
    'list.prices_visible': 'widoczne',
    'list.prices_hidden': 'ukryte',
    'list.estimated_total': 'Szacowany koszt',
    'list.hide_checked_products': 'Ukryj zaznaczone produkty',
    'list.show_checked_products': 'Pokaż zaznaczone produkty',
    'list.add_fab': 'Dodaj',
    'menu.rename': 'Zmień nazwę listy',
    'menu.share': 'Udostępnij',
    'menu.archive': 'Archiwuj listę',
    'menu.unarchive': 'Przywróć z archiwum',
    'menu.save_template': 'Zapisz jako szablon',
    'template.name': 'Nazwa szablonu',
    'template.create_from': 'Utwórz listę z szablonu',
    'stats.title': 'Statystyki',
    'stats.total_lists': 'Łącznie list',
    'stats.archived': 'W archiwum',
    'stats.total_products': 'Produkty łącznie',
    'stats.by_category': 'Według kategorii',
    'stats.estimated_cost': 'Szacowany koszt',
    'demo.limit_lists': 'Osiągnięto limit konta demo (max 2 listy). Załóż konto, aby mieć więcej.',
    'demo.limit_products': 'Osiągnięto limit produktów na liście (max 10 w wersji demo).',
    'demo.reset': 'Zresetuj dane demo',
    'demo.reset_done': 'Dane demo zresetowane.',
    'demo.banner_label': 'DEMO',
    'demo.banner_text':
      'To jest wersja demonstracyjna aplikacji. Dane są przechowywane lokalnie w przeglądarce.',
    'confirm.delete_list': 'Czy na pewno chcesz usunąć tę listę?',
    'confirm.delete_product': 'Czy na pewno chcesz usunąć ten produkt?',
    'confirm.uncheck_all': 'Czy na pewno chcesz odznaczyć wszystkie produkty?',
    'confirm.remove_purchased': 'Czy na pewno chcesz usunąć wszystkie kupione produkty z tej listy?',
    'confirm.revoke_share_email': 'Czy na pewno chcesz cofnąć udostępnienie dla {{email}}?',
    'confirm.stop_sharing_list': 'Czy na pewno chcesz przestać udostępniać tę listę?',
    'confirm.logout': 'Czy na pewno chcesz się wylogować?',
    'alert.no_purchased_to_remove': 'Brak kupionych produktów do usunięcia.',
    'app.no_archived': 'Brak zarchiwizowanych list.',
    'app.restore': 'Przywróć',
    'app.no_templates': 'Brak zapisanych szablonów.',
    'add.search_placeholder': 'Dodaj nową pozycję…',
    'add.tab_popular': 'Popularne',
    'add.tab_categories': 'Kategorie',
    'add.tab_recent': 'Ostatnie',
    'add.add_custom_named': 'Dodaj „{{name}}” jako własną pozycję',
    'add.no_search_results': 'Brak wyników w katalogu.',
    'add.no_recent': 'Tu pojawią się produkty, które ostatnio dodawałeś.',
    'add.add_product': 'Dodaj do listy',
    'add.add_product_purchased': 'Na liście — już kupione; dotknij, by dodać ponownie',
    'add.readonly_hint': 'Możesz tylko przeglądać tę listę — nie możesz dodawać produktów.',
    'add.tabs_aria': 'Widok produktów',
    'category.fruits_vegetables': 'Owoce i warzywa',
    'category.dairy': 'Nabiał',
    'category.meat': 'Mięso i wędliny',
    'category.bread': 'Pieczywo',
    'category.grains': 'Produkty sypkie',
    'category.beverages': 'Napoje',
    'category.sweets': 'Słodycze',
    'category.household': 'Chemia gospodarcza',
    'category.other': 'Inne',
    'priority.high': 'wysoki',
    'priority.medium': 'średni',
    'priority.low': 'niski',
    'unit.szt': 'szt.',
    'unit.g': 'g',
    'unit.kg': 'kg',
    'unit.ml': 'ml',
    'unit.l': 'l',
    'list.menu_search_list': 'Szukaj na liście',
    'menu.stop_sharing': 'Przestań udostępniać',
    'list.sort_sheet_title': 'Sortuj według',
    'list.sort_by_label': 'Sortuj według:',
    'list.sort_mode_category': 'Kategorie',
    'list.sort_mode_name': 'Alfabetycznie',
    'list.sort_mode_custom': 'Własne',
    'list.share_submit': 'Udostępnij',
    'list.share_email_placeholder': 'Email użytkownika',
    'list.share_email_required': 'Podaj adres email',
    'list.rename_prompt': 'Nowa nazwa listy:',
    'list.share_error_generic': 'Błąd udostępniania',
    'list.currency_suffix': 'zł',
    'app.loading': 'Ładowanie...',
    ...CATALOG_PRODUCT_NAMES_PL,
  },
  en: {
    'app.title': 'Shopping lists',
    'app.my_lists': 'My lists',
    'app.shared_lists': 'Shared with me',
    'app.new_list': 'New list',
    'app.archive': 'Archive',
    'app.from_template': 'From template',
    'app.templates': 'Templates',
    'app.save_template': 'Save as template',
    'app.stats': 'Statistics',
    'app.profile': 'Profile',
    'app.login': 'Log in',
    'app.logout': 'Log out',
    'app.theme_dark': 'Dark mode',
    'app.theme_light': 'Light mode',
    'app.empty_my_lists': "You don't have any shopping lists yet.",
    'app.empty_shared': "You don't have any shared lists yet.",
    'app.create_first': 'Create a new list to get started!',
    'app.list_name': 'List name',
    'app.create': 'Create',
    'app.cancel': 'Cancel',
    'dialog.ok': 'OK',
    'dialog.confirm': 'Confirm',
    'app.lang_switch_to_en': 'Switch to English',
    'app.lang_switch_to_pl': 'Switch to Polish',
    'app.products': 'Products',
    'app.created': 'Created',
    'app.shared_badge': 'Shared',
    'app.delete_list': 'Delete list',
    'list.back': 'Back',
    'list.share': 'Share list',
    'list.options': 'List options',
    'list.filter': 'Filter',
    'list.sort': 'Sort',
    'list.all': 'All',
    'list.purchased': 'Purchased',
    'list.not_purchased': 'Not purchased',
    'list.sort_name': 'Name',
    'list.sort_category': 'Category',
    'list.sort_priority': 'Priority',
    'list.sort_status': 'Status',
    'list.uncheck_all': 'Uncheck all',
    'list.search_products': 'Search in list...',
    'list.empty_products': 'No products on this list.',
    'list.add_products': 'Add products — tap the “Add” button at the bottom.',
    'list.quantity': 'Quantity',
    'list.price': 'Price',
    'list.note': 'Note',
    'list.save': 'Save',
    'list.delete': 'Delete',
    'list.edit': 'Edit',
    'list.theme': 'Theme',
    'list.theme_dark': 'dark',
    'list.theme_light': 'light',
    'list.rename': 'Rename list',
    'list.check_all': 'Check all products',
    'list.uncheck_all_btn': 'Uncheck all products',
    'list.remove_purchased': 'Remove purchased products',
    'list.show_prices': 'Show prices',
    'list.prices_visible': 'visible',
    'list.prices_hidden': 'hidden',
    'list.estimated_total': 'Estimated cost',
    'list.hide_checked_products': 'Hide checked products',
    'list.show_checked_products': 'Show checked products',
    'list.add_fab': 'Add',
    'menu.rename': 'Rename list',
    'menu.share': 'Share',
    'menu.archive': 'Archive list',
    'menu.unarchive': 'Restore from archive',
    'menu.save_template': 'Save as template',
    'template.name': 'Template name',
    'template.create_from': 'Create list from template',
    'stats.title': 'Statistics',
    'stats.total_lists': 'Total lists',
    'stats.archived': 'In archive',
    'stats.total_products': 'Total products',
    'stats.by_category': 'By category',
    'stats.estimated_cost': 'Estimated cost',
    'demo.limit_lists': 'Demo account limit reached (max 2 lists). Sign up for more.',
    'demo.limit_products': 'Product limit per list reached (max 10 in demo).',
    'demo.reset': 'Reset demo data',
    'demo.reset_done': 'Demo data reset.',
    'demo.banner_label': 'DEMO',
    'demo.banner_text':
      'This is a demo version of the app. Data is stored locally in your browser.',
    'confirm.delete_list': 'Are you sure you want to delete this list?',
    'confirm.delete_product': 'Are you sure you want to delete this product?',
    'confirm.uncheck_all': 'Are you sure you want to uncheck all products?',
    'confirm.remove_purchased': 'Are you sure you want to remove all purchased products from this list?',
    'confirm.revoke_share_email': 'Are you sure you want to revoke sharing for {{email}}?',
    'confirm.stop_sharing_list': 'Are you sure you want to stop sharing this list?',
    'confirm.logout': 'Are you sure you want to log out?',
    'alert.no_purchased_to_remove': 'No purchased products to remove.',
    'app.no_archived': 'No archived lists.',
    'app.restore': 'Restore',
    'app.no_templates': 'No saved templates.',
    'add.search_placeholder': 'Add a new item…',
    'add.tab_popular': 'Popular',
    'add.tab_categories': 'Categories',
    'add.tab_recent': 'Recent',
    'add.add_custom_named': 'Add “{{name}}” as a custom item',
    'add.no_search_results': 'No catalog matches.',
    'add.no_recent': 'Products you add recently will show up here.',
    'add.add_product': 'Add to list',
    'add.add_product_purchased': 'On list — already bought; tap to add again',
    'add.readonly_hint': 'This list is view-only — you cannot add products.',
    'add.tabs_aria': 'Product browser tabs',
    'category.fruits_vegetables': 'Fruit & vegetables',
    'category.dairy': 'Dairy',
    'category.meat': 'Meat & deli',
    'category.bread': 'Bakery',
    'category.grains': 'Dry goods & cereals',
    'category.beverages': 'Beverages',
    'category.sweets': 'Sweets',
    'category.household': 'Household',
    'category.other': 'Other',
    'priority.high': 'high',
    'priority.medium': 'medium',
    'priority.low': 'low',
    'unit.szt': 'pcs',
    'unit.g': 'g',
    'unit.kg': 'kg',
    'unit.ml': 'ml',
    'unit.l': 'l',
    'list.menu_search_list': 'Search in list',
    'menu.stop_sharing': 'Stop sharing',
    'list.sort_sheet_title': 'Sort by',
    'list.sort_by_label': 'Sort by:',
    'list.sort_mode_category': 'Category',
    'list.sort_mode_name': 'Alphabetical',
    'list.sort_mode_custom': 'Custom',
    'list.share_submit': 'Share',
    'list.share_email_placeholder': 'User email',
    'list.share_email_required': 'Enter an email address',
    'list.rename_prompt': 'New list name:',
    'list.share_error_generic': 'Sharing failed',
    'list.currency_suffix': 'PLN',
    'app.loading': 'Loading...',
    ...CATALOG_PRODUCT_NAMES_EN,
  },
};

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly LANG_KEY = 'app_lang';
  private lang = signal<Lang>('pl');

  constructor() {
    const saved = localStorage.getItem(this.LANG_KEY) as Lang | null;
    if (saved === 'pl' || saved === 'en') {
      this.lang.set(saved);
    }
  }

  currentLang = computed(() => this.lang());

  setLang(l: Lang): void {
    this.lang.set(l);
    localStorage.setItem(this.LANG_KEY, l);
  }

  get(key: string, params?: Record<string, string>): string {
    const l = this.lang();
    let s = TRANSLATIONS[l]?.[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.split(`{{${k}}}`).join(v);
      }
    }
    return s;
  }

  getCategoryLabel(category: ProductCategory): string {
    const key = PRODUCT_CATEGORY_KEYS[category];
    return key ? this.get(key) : String(category);
  }

  /** For category strings from storage/API (enum value in Polish); unknown values returned as-is. */
  getCategoryLabelFromData(category: string): string {
    if (STORED_CATEGORY_VALUES.has(category)) {
      return this.getCategoryLabel(category as ProductCategory);
    }
    return category;
  }

  getPriorityLabel(priority: ProductPriority): string {
    const key = PRODUCT_PRIORITY_KEYS[priority];
    return key ? this.get(key) : String(priority);
  }

  /** Localized quantity unit (e.g. szt. / pcs); unknown codes left as-is. */
  formatQuantityUnit(unit: string): string {
    const key = `unit.${unit}`;
    const t = this.get(key);
    return t === key ? unit : t;
  }

  /**
   * Single label for the active UI language (PL or EN), never both.
   * Catalog rows use i18n by id; custom / unknown ids use stored `name`.
   */
  getProductDisplayName(product: { id: string; name: string }): string {
    const catalogId = resolveCatalogProductIdForDisplay(product.id);
    if (catalogId !== undefined) {
      return this.get(`catalog.product.${catalogId}`);
    }
    return product.name;
  }
}
