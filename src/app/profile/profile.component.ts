import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { UiDialogService } from '../services/ui-dialog.service';
import { BackControlComponent } from '../shared/back-control.component';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, BackControlComponent, TranslatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);
  /** Back target: list detail when opened via avatar (`?listId=`), otherwise home. */
  backLink = signal<string | unknown[]>(['/']);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private uiDialog: UiDialogService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(this.authService.getCurrentUser());
    const listId = this.route.snapshot.queryParamMap.get('listId')?.trim();
    this.backLink.set(listId ? ['/list', listId] : ['/']);
  }

  async logout(): Promise<void> {
    const ok = await this.uiDialog.confirm('confirm.logout');
    if (!ok) return;
    this.authService.logout();
  }
}
