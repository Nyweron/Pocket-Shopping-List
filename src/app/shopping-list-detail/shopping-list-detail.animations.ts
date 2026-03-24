import { animate, style, transition, trigger } from '@angular/animations';

const ease = 'cubic-bezier(0.33, 1, 0.68, 1)';
const dur = '300ms';

/**
 * Unchecked products: leave animates downward (toward the checked section);
 * enter arrives from below (returning from checked).
 */
export const activeProductRowAnim = trigger('activeProductRow', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(18px)' }),
    animate(`${dur} ${ease}`, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate(`${dur} ${ease}`, style({ opacity: 0, transform: 'translateY(22px)' })),
  ]),
]);

/**
 * Checked products: leave animates upward (back to active);
 * enter arrives from above (just checked).
 */
export const completedProductRowAnim = trigger('completedProductRow', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-18px)' }),
    animate(`${dur} ${ease}`, style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate(`${dur} ${ease}`, style({ opacity: 0, transform: 'translateY(-22px)' })),
  ]),
]);
