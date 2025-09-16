import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/new-article',
    loadComponent: () => import('./pages/article-editor/article-editor.component').then(m => m.ArticleEditorComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'dashboard/edit-article/:id',
    loadComponent: () => import('./pages/article-editor/article-editor.component').then(m => m.ArticleEditorComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'article/:id',
    loadComponent: () => import('./pages/article-detail/article-detail.component').then(m => m.ArticleDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];