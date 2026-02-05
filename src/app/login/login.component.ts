import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Jeśli użytkownik jest już zalogowany, przekieruj do głównej strony
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.error.set(null);
    
    if (!this.email || !this.password) {
      this.error.set('Wypełnij wszystkie pola');
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
      this.error.set(result.error || 'Błąd logowania');
    }
  }
}
