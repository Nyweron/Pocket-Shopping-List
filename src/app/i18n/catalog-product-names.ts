/**
 * Built-in catalog product names (ids '1'–'70' in ProductService).
 * UI shows either PL or EN via TranslateService — never both at once.
 */
export const CATALOG_PRODUCT_I18N: Record<string, { pl: string; en: string }> = {
  '1': { pl: 'Jabłka', en: 'Apples' },
  '2': { pl: 'Banan', en: 'Banana' },
  '3': { pl: 'Pomidory', en: 'Tomatoes' },
  '4': { pl: 'Ogórki', en: 'Cucumbers' },
  '5': { pl: 'Marchew', en: 'Carrots' },
  '6': { pl: 'Cebula', en: 'Onions' },
  '7': { pl: 'Ziemniaki', en: 'Potatoes' },
  '8': { pl: 'Papryka', en: 'Bell pepper' },
  '9': { pl: 'Sałata', en: 'Lettuce' },
  '10': { pl: 'Cytryny', en: 'Lemons' },
  '11': { pl: 'Mleko', en: 'Milk' },
  '12': { pl: 'Jajka', en: 'Eggs' },
  '13': { pl: 'Masło', en: 'Butter' },
  '14': { pl: 'Ser żółty', en: 'Yellow cheese' },
  '15': { pl: 'Ser biały', en: 'White cheese' },
  '16': { pl: 'Jogurt', en: 'Yogurt' },
  '17': { pl: 'Śmietana', en: 'Sour cream' },
  '18': { pl: 'Twaróg', en: 'Cottage cheese' },
  '19': { pl: 'Kurczak', en: 'Chicken' },
  '20': { pl: 'Wołowina', en: 'Beef' },
  '21': { pl: 'Wieprzowina', en: 'Pork' },
  '22': { pl: 'Szynka', en: 'Ham' },
  '23': { pl: 'Kiełbasa', en: 'Sausage' },
  '24': { pl: 'Boczek', en: 'Bacon' },
  '25': { pl: 'Chleb', en: 'Bread' },
  '26': { pl: 'Bułki', en: 'Bread rolls' },
  '27': { pl: 'Bagietka', en: 'Baguette' },
  '28': { pl: 'Mąka', en: 'Flour' },
  '29': { pl: 'Cukier', en: 'Sugar' },
  '30': { pl: 'Ryż', en: 'Rice' },
  '31': { pl: 'Makaron', en: 'Pasta' },
  '32': { pl: 'Płatki owsiane', en: 'Oat flakes' },
  '33': { pl: 'Kasza', en: 'Groats' },
  '34': { pl: 'Woda', en: 'Water' },
  '35': { pl: 'Sok', en: 'Juice' },
  '36': { pl: 'Kawa', en: 'Coffee' },
  '37': { pl: 'Herbata', en: 'Tea' },
  '38': { pl: 'Piwo', en: 'Beer' },
  '39': { pl: 'Czekolada', en: 'Chocolate' },
  '40': { pl: 'Ciastka', en: 'Cookies' },
  '41': { pl: 'Lody', en: 'Ice cream' },
  '42': { pl: 'Proszek do prania', en: 'Laundry detergent' },
  '43': { pl: 'Płyn do mycia naczyń', en: 'Dish soap' },
  '44': { pl: 'Papier toaletowy', en: 'Toilet paper' },
  '45': { pl: 'Środki czystości', en: 'Cleaning supplies' },
  '46': { pl: 'Worki na śmieci', en: 'Trash bags' },
  '47': { pl: 'Olej', en: 'Oil' },
  '48': { pl: 'Ocet', en: 'Vinegar' },
  '49': { pl: 'Sól', en: 'Salt' },
  '50': { pl: 'Pieprz', en: 'Pepper' },
  '51': { pl: 'Parówki', en: 'Frankfurters' },
  '52': { pl: 'Czosnek', en: 'Garlic' },
  '53': { pl: 'Pietruszka', en: 'Parsley' },
  '54': { pl: 'Ketchup', en: 'Ketchup' },
  '55': { pl: 'Majonez', en: 'Mayonnaise' },
  '56': { pl: 'Masło orzechowe', en: 'Peanut butter' },
  '57': { pl: 'Dżem', en: 'Jam' },
  '58': { pl: 'Musztarda', en: 'Mustard' },
  '59': { pl: 'Śmietanka 30%', en: 'Heavy cream (30%)' },
  '60': { pl: 'Ser mozzarella', en: 'Mozzarella' },
  '61': { pl: 'Szpinak', en: 'Spinach' },
  '62': { pl: 'Brokuły', en: 'Broccoli' },
  '63': { pl: 'Cukinia', en: 'Zucchini' },
  '64': { pl: 'Cytryna', en: 'Lemon' },
  '65': { pl: 'Awokado', en: 'Avocado' },
  '66': { pl: 'Hummus', en: 'Hummus' },
  '67': { pl: 'Tortilla', en: 'Tortilla' },
  '68': { pl: 'Płatki śniadaniowe', en: 'Breakfast cereal' },
  '69': { pl: 'Orzechy', en: 'Nuts' },
  '70': { pl: 'Rodzynki', en: 'Raisins' },
};

function expandCatalogKeys(lang: 'pl' | 'en'): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [id, v] of Object.entries(CATALOG_PRODUCT_I18N)) {
    out[`catalog.product.${id}`] = lang === 'pl' ? v.pl : v.en;
  }
  return out;
}

export const CATALOG_PRODUCT_NAMES_PL = expandCatalogKeys('pl');
export const CATALOG_PRODUCT_NAMES_EN = expandCatalogKeys('en');

/** Catalog-only product ids (stored on lists when added from catalog). */
export const CATALOG_PRODUCT_IDS: ReadonlySet<string> = new Set(Object.keys(CATALOG_PRODUCT_I18N));

/**
 * Shopping list rows get unique ids (`catalogId_timestamp_random`) when added from the catalog.
 * Resolve the catalog id for i18n, or undefined if not a catalog row.
 */
export function resolveCatalogProductIdForDisplay(listProductId: string): string | undefined {
  if (CATALOG_PRODUCT_IDS.has(listProductId)) {
    return listProductId;
  }
  const u = listProductId.indexOf('_');
  if (u <= 0) {
    return undefined;
  }
  const prefix = listProductId.slice(0, u);
  return CATALOG_PRODUCT_IDS.has(prefix) ? prefix : undefined;
}
