import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    try {
      const user = this.authService.getCurrentUser();

      if (!user) {
        console.warn('[RoleGuard] No user found, redirecting to login');
        this.router.navigate(['/auth/login']);
        return false;
      }

      const requiredRoles: UserRole[] = route.data['roles'] || [];

      // If no roles specified, allow access
      if (requiredRoles.length === 0) {
        return true;
      }

      // Check if user's role is in required roles
      if (requiredRoles.includes(user.role)) {
        return true;
      }

      // User doesn't have required role
      console.warn('[RoleGuard] User role not authorized. Required:', requiredRoles, 'User role:', user.role);
      this.router.navigate(['/not-authorized']);
      return false;
    } catch (error) {
      console.error('[RoleGuard] Error checking user role:', error);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
