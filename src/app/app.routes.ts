import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shopping-lists/shopping-lists.component').then(m => m.ShoppingListsComponent)
  },
  {
    path: 'list/:id/add',
    canActivate: [authGuard],
    loadComponent: () => import('./add-products-page/add-products-page.component').then(m => m.AddProductsPageComponent)
  },
  {
    path: 'list/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./shopping-list-detail/shopping-list-detail.component').then(m => m.ShoppingListDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'stats',
    canActivate: [authGuard],
    loadComponent: () => import('./stats/stats.component').then(m => m.StatsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
