import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shopping-lists/shopping-lists.component').then(m => m.ShoppingListsComponent)
  },
  {
    path: 'list/:id',
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
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.component').then(m => m.StatsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
