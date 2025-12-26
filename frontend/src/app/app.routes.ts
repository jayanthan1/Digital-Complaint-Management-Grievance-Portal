import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: 'complaints',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/complaints/complaint-list/complaint-list.component').then(m => m.ComplaintListComponent)
  },
  {
    path: 'complaints/new',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
    loadComponent: () => import('./features/complaints/complaint-form/complaint-form.component').then(m => m.ComplaintFormComponent)
  },
  {
    path: 'complaints/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/complaints/complaint-details/complaint-details.component').then(m => m.ComplaintDetailsComponent)
  },
  {
    path: 'staff/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['staff', 'admin'] },
    loadComponent: () => import('./features/complaints/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent)
  },
  {
    path: 'admin/dashboard',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./shared/components/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
  },
  {
    path: '',
    redirectTo: '/complaints',
    pathMatch: 'full'
  }
];
