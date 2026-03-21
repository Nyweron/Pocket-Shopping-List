import { Pipe, PipeTransform, ChangeDetectorRef, inject } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  transform(key: string, params?: Record<string, string>): string {
    this.translate.currentLang();
    return this.translate.get(key, params);
  }
}
