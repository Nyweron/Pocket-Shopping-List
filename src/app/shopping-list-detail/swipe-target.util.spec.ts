import { isSwipeDeleteTarget } from './swipe-target.util';

describe('isSwipeDeleteTarget', () => {
  it('returns true for the delete button and inner nodes', () => {
    const btn = document.createElement('button');
    btn.className = 'swipe-delete';
    const span = document.createElement('span');
    btn.appendChild(span);

    expect(isSwipeDeleteTarget(btn)).toBeTrue();
    expect(isSwipeDeleteTarget(span)).toBeTrue();
  });

  it('returns false for unrelated elements', () => {
    const div = document.createElement('div');
    expect(isSwipeDeleteTarget(div)).toBeFalse();
    expect(isSwipeDeleteTarget(null)).toBeFalse();
  });
});
