import { Injectable } from '@angular/core';
import { Product, ProductPriority } from '../models/product.model';
import { ProductCategory } from '../models/product-category.enum';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_KEY = 'user_products';
  private defaultProducts: Product[] = [
    // Fruits & vegetables
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
    
    // Dairy
    { id: '11', name: 'Mleko', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '12', name: 'Jajka', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '13', name: 'Masło', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '14', name: 'Ser żółty', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '15', name: 'Ser biały', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '16', name: 'Jogurt', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '17', name: 'Śmietana', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '18', name: 'Twaróg', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Meat & cold cuts
    { id: '19', name: 'Kurczak', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '20', name: 'Wołowina', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '21', name: 'Wieprzowina', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '22', name: 'Szynka', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '23', name: 'Kiełbasa', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '24', name: 'Boczek', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Bread & bakery
    { id: '25', name: 'Chleb', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '26', name: 'Bułki', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '27', name: 'Bagietka', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Dry goods / grains
    { id: '28', name: 'Mąka', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '29', name: 'Cukier', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '30', name: 'Ryż', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '31', name: 'Makaron', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '32', name: 'Płatki owsiane', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '33', name: 'Kasza', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Beverages
    { id: '34', name: 'Woda', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '35', name: 'Sok', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '36', name: 'Kawa', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '37', name: 'Herbata', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '38', name: 'Piwo', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Sweets
    { id: '39', name: 'Czekolada', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '40', name: 'Ciastka', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '41', name: 'Lody', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    
    // Household / cleaning
    { id: '42', name: 'Proszek do prania', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '43', name: 'Płyn do mycia naczyń', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '44', name: 'Papier toaletowy', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '45', name: 'Środki czystości', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '46', name: 'Worki na śmieci', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    
    // Other
    { id: '47', name: 'Olej', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '48', name: 'Ocet', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '49', name: 'Sól', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '50', name: 'Pieprz', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },

    // Extra everyday items (PL)
    { id: '51', name: 'Parówki', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '52', name: 'Czosnek', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '53', name: 'Pietruszka', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '54', name: 'Ketchup', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '55', name: 'Majonez', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '56', name: 'Masło orzechowe', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '57', name: 'Dżem', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '58', name: 'Musztarda', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '59', name: 'Śmietanka 30%', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '60', name: 'Ser mozzarella', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '61', name: 'Szpinak', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '62', name: 'Brokuły', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '63', name: 'Cukinia', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '64', name: 'Cytryna', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '65', name: 'Awokado', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '66', name: 'Hummus', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '67', name: 'Tortilla', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '68', name: 'Płatki śniadaniowe', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '69', name: 'Orzechy', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '70', name: 'Rodzynki', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '71', name: 'Gruszki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '72', name: 'Winogrona', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '73', name: 'Kalafior', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '74', name: 'Buraki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '75', name: 'Rukola', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '76', name: 'Kefir', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '77', name: 'Maślanka', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '78', name: 'Łosoś', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '79', name: 'Tuńczyk', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '80', name: 'Pita', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '81', name: 'Ryż basmati', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '82', name: 'Soczewica', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '83', name: 'Mleko owsiane', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '84', name: 'Napój izotoniczny', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '85', name: 'Baton proteinowy', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '86', name: 'Miód', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '87', name: 'Ręczniki papierowe', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '88', name: 'Płyn do szyb', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '89', name: 'Folia aluminiowa', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '90', name: 'Papryka ostra', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '91', name: 'Pomarańcze', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '92', name: 'Mandarynki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '93', name: 'Truskawki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '94', name: 'Borówki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '95', name: 'Maliny', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '96', name: 'Kiwi', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '97', name: 'Ananas', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '98', name: 'Kapusta', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '99', name: 'Por', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '100', name: 'Seler', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '101', name: 'Pieczarki', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '102', name: 'Bataty', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '103', name: 'Rzodkiewka', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '104', name: 'Brukselka', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '105', name: 'Burak liściowy', category: ProductCategory.FRUITS_VEGETABLES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '106', name: 'Mleko bez laktozy', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '107', name: 'Mleko migdałowe', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '108', name: 'Serek wiejski', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '109', name: 'Ser feta', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '110', name: 'Ser cheddar', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '111', name: 'Skyr', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '112', name: 'Kefir naturalny', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '113', name: 'Mascarpone', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '114', name: 'Ricotta', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '115', name: 'Jajka przepiórcze', category: ProductCategory.DAIRY, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '116', name: 'Indyk', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '117', name: 'Mięso mielone', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '118', name: 'Schab', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '119', name: 'Karkówka', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '120', name: 'Filet z kurczaka', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '121', name: 'Udka z kurczaka', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '122', name: 'Łopatka wieprzowa', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '123', name: 'Szynka dojrzewająca', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '124', name: 'Salami', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '125', name: 'Krewetki', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '126', name: 'Dorsz', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '127', name: 'Makrela', category: ProductCategory.MEAT, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '128', name: 'Chleb pełnoziarnisty', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '129', name: 'Chleb tostowy', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '130', name: 'Kajzerki', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '131', name: 'Croissant', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '132', name: 'Pączki', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '133', name: 'Drożdżówki', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '134', name: 'Bułka tarta', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '135', name: 'Tortille pełnoziarniste', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '136', name: 'Wrapy', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '137', name: 'Chleb żytni', category: ProductCategory.BREAD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '138', name: 'Kasza jaglana', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '139', name: 'Kasza gryczana', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '140', name: 'Komosa ryżowa', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '141', name: 'Płatki kukurydziane', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '142', name: 'Muesli', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '143', name: 'Ryż jaśminowy', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '144', name: 'Makaron spaghetti', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '145', name: 'Makaron penne', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '146', name: 'Makaron ryżowy', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '147', name: 'Ciecierzyca', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '148', name: 'Fasola czerwona', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '149', name: 'Płatki jaglane', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '150', name: 'Bulgur', category: ProductCategory.GRAINS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '151', name: 'Woda gazowana', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '152', name: 'Woda niegazowana', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '153', name: 'Cola', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '154', name: 'Lemoniada', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '155', name: 'Sok pomarańczowy', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '156', name: 'Sok jabłkowy', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '157', name: 'Napój kokosowy', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '158', name: 'Napój sojowy', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '159', name: 'Napój energetyczny', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '160', name: 'Kakao', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '161', name: 'Syrop malinowy', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '162', name: 'Woda smakowa', category: ProductCategory.BEVERAGES, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '163', name: 'Wafle ryżowe', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '164', name: 'Chipsy ziemniaczane', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '165', name: 'Paluszki słone', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '166', name: 'Krakersy', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '167', name: 'Żelki', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '168', name: 'Ciasto brownie', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '169', name: 'Budyń', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '170', name: 'Kisiel', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '171', name: 'Chałwa', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '172', name: 'Baton czekoladowy', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '173', name: 'Krem czekoladowy', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '174', name: 'Popcorn', category: ProductCategory.SWEETS, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '175', name: 'Płyn do podłóg', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '176', name: 'Gąbki do naczyń', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '177', name: 'Ściereczki', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '178', name: 'Chusteczki higieniczne', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '179', name: 'Mydło w płynie', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '180', name: 'Szampon', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '181', name: 'Pasta do zębów', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.HIGH, isPurchased: false },
    { id: '182', name: 'Płyn do płukania tkanin', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '183', name: 'Tabletki do zmywarki', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '184', name: 'Płyn do WC', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '185', name: 'Rękawiczki jednorazowe', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '186', name: 'Worki strunowe', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '187', name: 'Folia spożywcza', category: ProductCategory.HOUSEHOLD, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '188', name: 'Sos sojowy', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '189', name: 'Sos pomidorowy', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '190', name: 'Passata', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.MEDIUM, isPurchased: false },
    { id: '191', name: 'Przyprawa do kurczaka', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '192', name: 'Oregano', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '193', name: 'Bazylia', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '194', name: 'Cynamon', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '195', name: 'Proszek do pieczenia', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '196', name: 'Soda oczyszczona', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '197', name: 'Drożdże', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '198', name: 'Wiórki kokosowe', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '199', name: 'Sezam', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
    { id: '200', name: 'Pestki dyni', category: ProductCategory.OTHER, quantity: 1, priority: ProductPriority.LOW, isPurchased: false },
  ];

  /** Catalog ids in “Popularne” order (everyday staples). */
  private readonly popularCatalogIds = [
    '7',
    '51',
    '25',
    '12',
    '28',
    '11',
    '34',
    '13',
    '6',
    '52',
    '1',
    '5',
    '3',
    '19',
    '42',
    '44',
    '35',
    '36'
  ];

  constructor(private translate: TranslateService) {}

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      return [];
    }
    
    const allProducts = this.getAllProducts();
    return allProducts.filter(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      const display = this.translate.getProductDisplayName(product).toLowerCase();
      return display.includes(lowerQuery);
    });
  }

  getAllProducts(): Product[] {
    return [...this.defaultProducts];
  }

  /** Curated subset for the “Popularne” tab (falls back if id missing). */
  getPopularProducts(): Product[] {
    const byId = new Map(this.defaultProducts.map(p => [p.id, p]));
    const ordered: Product[] = [];
    for (const id of this.popularCatalogIds) {
      const p = byId.get(id);
      if (p) {
        ordered.push({ ...p });
      }
    }
    return ordered;
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

