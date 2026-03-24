import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';

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
    public translate: TranslateService
  ) {
    // If already logged in, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
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
      this.router.navigate(['/']);
    } else {
      this.error.set(result.error || 'auth.error_login_generic');
    }
  }
}
