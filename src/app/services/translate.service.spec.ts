import { TestBed } from '@angular/core/testing';
import { ProductCategory } from '../models/product-category.enum';
import { TranslateService } from './translate.service';

describe('TranslateService', () => {
  let service: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateService);
  });

  it('getCategoryLabelFromData maps stored enum string to current language', () => {
    service.setLang('en');
    expect(service.getCategoryLabelFromData(ProductCategory.DAIRY)).toBe('Dairy');
    service.setLang('pl');
    expect(service.getCategoryLabelFromData(ProductCategory.DAIRY)).toBe('Nabiał');
  });

  it('getCategoryLabelFromData leaves unknown labels unchanged', () => {
    service.setLang('en');
    expect(service.getCategoryLabelFromData('Custom aisle')).toBe('Custom aisle');
  });
});
