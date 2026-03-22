import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';
import { UiDialogService } from '../services/ui-dialog.service';

@Component({
  selector: 'app-dialog-host',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './dialog-host.component.html',
  styleUrl: './dialog-host.component.css',
})
export class DialogHostComponent {
  readonly uiDialog = inject(UiDialogService);

  onBackdropClick(): void {
    const s = this.uiDialog.state();
    if (!s) return;
    if (s.kind === 'confirm') {
      this.uiDialog.resolveConfirm(false);
    }
  }

  cancel(): void {
    this.uiDialog.resolveConfirm(false);
  }

  confirmOk(): void {
    this.uiDialog.resolveConfirm(true);
  }

  alertOk(): void {
    this.uiDialog.resolveAlert();
  }
}
