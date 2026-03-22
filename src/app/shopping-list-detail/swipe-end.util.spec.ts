import { shouldSwipeStayOpen, shouldSuppressNextRowClickAfterSwipe } from './swipe-end.util';

describe('shouldSwipeStayOpen', () => {
  it('returns false when barely dragged or not dragged', () => {
    expect(shouldSwipeStayOpen(0)).toBeFalse();
    expect(shouldSwipeStayOpen(-10)).toBeFalse();
    expect(shouldSwipeStayOpen(-25)).toBeFalse();
  });

  it('returns true at threshold and beyond', () => {
    expect(shouldSwipeStayOpen(-26)).toBeTrue();
    expect(shouldSwipeStayOpen(-40)).toBeTrue();
    expect(shouldSwipeStayOpen(-80)).toBeTrue();
  });

  it('respects custom openAfterPx', () => {
    expect(shouldSwipeStayOpen(-9, 10)).toBeFalse();
    expect(shouldSwipeStayOpen(-10, 10)).toBeTrue();
    expect(shouldSwipeStayOpen(-15, 10)).toBeTrue();
  });
});

describe('shouldSuppressNextRowClickAfterSwipe', () => {
  const id = 'p1';

  it('is true only when row was closed before and opens for this product after swipe end', () => {
    expect(shouldSuppressNextRowClickAfterSwipe(false, id, id)).toBeTrue();
  });

  it('is false when row was already swiped open (tap-to-collapse still uses click)', () => {
    expect(shouldSuppressNextRowClickAfterSwipe(true, id, id)).toBeFalse();
  });

  it('is false when swipe did not open the strip', () => {
    expect(shouldSuppressNextRowClickAfterSwipe(false, null, id)).toBeFalse();
    expect(shouldSuppressNextRowClickAfterSwipe(false, 'other', id)).toBeFalse();
  });
});
