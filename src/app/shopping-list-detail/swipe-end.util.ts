/**
 * Resolves whether a horizontal swipe should stay "open" (delete strip visible).
 * @param finalTranslateX translateX in px (negative = dragged left, max about -80)
 * @param openAfterPx how many pixels left the user must pass to lock open (default ~1/3 of 80px track)
 */
export function shouldSwipeStayOpen(finalTranslateX: number, openAfterPx = 26): boolean {
  return finalTranslateX <= -openAfterPx;
}

/**
 * After a swipe opens the delete strip, the browser still fires a synthetic `click` on the row.
 * Set a one-shot ignore flag when the row was closed before the gesture and is open after `applySwipeEnd`.
 */
export function shouldSuppressNextRowClickAfterSwipe(
  wasSwipedOpenBefore: boolean,
  swipedProductIdAfter: string | null,
  productId: string,
): boolean {
  return !wasSwipedOpenBefore && swipedProductIdAfter === productId;
}
