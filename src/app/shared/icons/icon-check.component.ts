import { Component } from '@angular/core';

/** Vector checkmark; uses `currentColor` for stroke. */
@Component({
  selector: 'app-icon-check',
  standalone: true,
  template: `
    <svg
      class="icon-check-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 1em;
      height: 1em;
    }
    .icon-check-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `
})
export class IconCheckComponent {}
