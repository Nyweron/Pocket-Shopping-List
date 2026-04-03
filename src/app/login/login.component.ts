import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { navigateAfterAuth } from '../auth/auth-redirect.util';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  /** i18n keys; template uses TranslatePipe. */
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    if (this.authService.isAuthenticated()) {
      navigateAfterAuth(this.router, this.route);
    }
  }

  onSubmit(): void {
    this.error.set(null);
    
    if (!this.email || !this.password) {
      this.error.set('auth.error_fill_fields');
      return;
    }

    this.isLoading.set(true);
    
    const result = this.authService.login({
      email: this.email,
      password: this.password
    });

    this.isLoading.set(false);

    if (result.success) {
      navigateAfterAuth(this.router, this.route);
    } else {
      this.error.set(result.error || 'auth.error_login_generic');
    }
  }
}
