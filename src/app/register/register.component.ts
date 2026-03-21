import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.error.set(null);
    
    if (!this.email || !this.username || !this.password || !this.confirmPassword) {
      this.error.set('Wypełnij wszystkie pola');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error.set('Hasła nie są identyczne');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('Hasło musi mieć co najmniej 6 znaków');
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
      this.router.navigate(['/']);
    } else {
      this.error.set(result.error || 'Błąd rejestracji');
    }
  }
}
