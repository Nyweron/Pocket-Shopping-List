/** True if the event target is the delete control (button or its children). */
export function isSwipeDeleteTarget(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest('.swipe-delete');
}
