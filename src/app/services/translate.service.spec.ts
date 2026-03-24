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

  it('getProductDisplayName uses one language for catalog id', () => {
    const p = { id: '11', name: 'Mleko' };
    service.setLang('pl');
    expect(service.getProductDisplayName(p)).toBe('Mleko');
    service.setLang('en');
    expect(service.getProductDisplayName(p)).toBe('Milk');
  });

  it('getProductDisplayName resolves catalog id from list row id (timestamp suffix)', () => {
    const p = { id: '11_1734567890123_ab12cd34', name: 'Mleko' };
    service.setLang('en');
    expect(service.getProductDisplayName(p)).toBe('Milk');
    service.setLang('pl');
    expect(service.getProductDisplayName(p)).toBe('Mleko');
  });

  it('getProductDisplayName falls back to stored name for non-catalog ids', () => {
    service.setLang('en');
    expect(service.getProductDisplayName({ id: 'custom_x', name: 'My item' })).toBe('My item');
  });
});
