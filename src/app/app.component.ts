import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { DemoLimitService } from './services/demo-limit.service';
import { RefreshListsService } from './services/refresh-lists.service';
import { TranslatePipe } from './pipes/translate.pipe';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    public authService: AuthService,
    public demoLimit: DemoLimitService,
    private refreshLists: RefreshListsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.initTheme();
  }

  onDemoReset(): void {
    this.authService.resetDemoUserData();
    this.authService.setDemoLastResetNow();
    this.demoLimit.dismiss();
    this.refreshLists.refresh();
    this.router.navigate(['/']);
  }
}
