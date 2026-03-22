import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { UiDialogService } from '../services/ui-dialog.service';
import { BackControlComponent } from '../shared/back-control.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, BackControlComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user = signal<User | null>(null);

  constructor(
    private authService: AuthService,
    private router: Router,
    private uiDialog: UiDialogService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.user.set(this.authService.getCurrentUser());
  }

  async logout(): Promise<void> {
    const ok = await this.uiDialog.confirm('confirm.logout');
    if (!ok) return;
    this.authService.logout();
  }
}
