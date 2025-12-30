import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    try {
      const isLoggedIn = this.authService.isLoggedIn();
      const token = this.authService.getToken();
      
      if (isLoggedIn && token) {
        return true;
      }
      
      // User is not authenticated
      console.warn('[AuthGuard] User not authenticated, redirecting to login');
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    } catch (error) {
      console.error('[AuthGuard] Error checking authentication:', error);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
