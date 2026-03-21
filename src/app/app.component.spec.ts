import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service';
import { DemoLimitService } from './services/demo-limit.service';
import { RefreshListsService } from './services/refresh-lists.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: jasmine.createSpyObj('ThemeService', ['initTheme']) },
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['isDemoUser', 'resetDemoUserData', 'setDemoLastResetNow']) },
        { provide: DemoLimitService, useValue: jasmine.createSpyObj('DemoLimitService', ['dismiss'], { limitReached: () => null }) },
        { provide: RefreshListsService, useValue: jasmine.createSpyObj('RefreshListsService', ['refresh']) },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
