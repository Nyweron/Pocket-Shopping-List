import { Injectable, signal } from '@angular/core';

export type UiDialogState =
  | {
      kind: 'confirm';
      messageKey: string;
      messageParams?: Record<string, string>;
      resolve: (ok: boolean) => void;
    }
  | {
      kind: 'alert';
      messageKey: string;
      messageParams?: Record<string, string>;
      resolve: () => void;
    };

/**
 * In-app modal dialogs (replaces native alert/confirm) for consistent UI and i18n.
 * Rendered by {@link DialogHostComponent} in {@link AppComponent}.
 */
@Injectable({ providedIn: 'root' })
export class UiDialogService {
  readonly state = signal<UiDialogState | null>(null);

  confirm(messageKey: string, messageParams?: Record<string, string>): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.state.set({
        kind: 'confirm',
        messageKey,
        messageParams,
        resolve,
      });
    });
  }

  alert(messageKey: string, messageParams?: Record<string, string>): Promise<void> {
    return new Promise<void>(resolve => {
      this.state.set({
        kind: 'alert',
        messageKey,
        messageParams,
        resolve,
      });
    });
  }

  /** Called by dialog host when user dismisses the dialog. */
  resolveConfirm(ok: boolean): void {
    const s = this.state();
    if (s?.kind === 'confirm') {
      s.resolve(ok);
      this.state.set(null);
    }
  }

  resolveAlert(): void {
    const s = this.state();
    if (s?.kind === 'alert') {
      s.resolve();
      this.state.set(null);
    }
  }
}
