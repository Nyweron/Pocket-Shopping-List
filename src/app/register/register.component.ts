import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { navigateAfterAuth } from '../auth/auth-redirect.util';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  /** i18n keys; template uses TranslatePipe. */
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isAuthenticated()) {
      navigateAfterAuth(this.router, this.route);
    }
  }

  onSubmit(): void {
    this.error.set(null);
    
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.error.set('auth.error_fill_fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('auth.error_password_mismatch');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('auth.error_password_short');
      return;
    }

    this.isLoading.set(true);
    
    const result = this.authService.register({
      email: this.email,
      username: this.username,
      password: this.password
    });

    this.isLoading.set(false);

    if (result.success) {
      navigateAfterAuth(this.router, this.route);
    } else {
      this.error.set(result.error || 'auth.error_register_generic');
    }
  }
}
