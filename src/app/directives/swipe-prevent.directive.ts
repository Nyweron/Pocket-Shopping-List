import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';

/**
 * Prevents page scroll when the user swipes horizontally on the host element.
 * touchmove uses passive: false so preventDefault() can run.
 */
@Directive({
  selector: '[appSwipePrevent]',
  standalone: true
})
export class SwipePreventDirective implements OnInit, OnDestroy {
  private touchStartX = 0;
  private touchStartY = 0;
  private listeners: (() => void)[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    const el = this.el.nativeElement;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.touchStartX;
      const dy = e.touches[0].clientY - this.touchStartY;
      // Only block default on clear horizontal gesture
      if (Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      this.touchStartX = 0;
      this.touchStartY = 0;
    };

    el.addEventListener('touchstart', onTouchStart as EventListener, { passive: true });
    el.addEventListener('touchmove', onTouchMove as EventListener, { passive: false });
    el.addEventListener('touchend', onTouchEnd as EventListener, { passive: true });

    this.listeners.push(
      () => el.removeEventListener('touchstart', onTouchStart as EventListener),
      () => el.removeEventListener('touchmove', onTouchMove as EventListener),
      () => el.removeEventListener('touchend', onTouchEnd as EventListener)
    );
  }

  ngOnDestroy(): void {
    this.listeners.forEach(fn => fn());
  }
}
