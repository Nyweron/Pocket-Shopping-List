import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RefreshListsService {
  /** Exposed so components can read in effect() for dependency tracking. */
  readonly trigger = signal(0);

  /** Call to notify that lists data changed (e.g. after demo reset). */
  refresh(): void {
    this.trigger.update(v => v + 1);
  }
}
