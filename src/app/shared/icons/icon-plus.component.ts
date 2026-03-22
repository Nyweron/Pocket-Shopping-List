import { Component } from '@angular/core';

/** Vector “+” for add actions; uses `currentColor` for stroke. */
@Component({
  selector: 'app-icon-plus',
  standalone: true,
  template: `
    <svg
      class="icon-plus-svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.25"
      stroke-linecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
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
    .icon-plus-svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `
})
export class IconPlusComponent {}
