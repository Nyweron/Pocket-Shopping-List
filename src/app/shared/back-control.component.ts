import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../pipes/translate.pipe';

/**
 * Circular “back” control with the same SVG chevron as list detail / add-products / stats.
 * Use {@link backAsButton} with {@link backClick} when navigation is handled in code (e.g. add-products).
 */
@Component({
  selector: 'app-back-control',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './back-control.component.html',
  styleUrl: './back-control.component.css',
})
export class BackControlComponent {
  /** When true, renders a button and emits {@link backClick}; otherwise uses {@link routerLink}. */
  @Input() backAsButton = false;
  @Input() routerLink: string | unknown[] = '/';
  @Input() ariaLabelKey = 'list.back';
  /** e.g. `add-page-back` for e2e */
  @Input() testId = '';
  @Output() backClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.backClick.emit();
  }
}
