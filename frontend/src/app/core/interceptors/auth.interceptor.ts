import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(private authService: AuthService) {
    console.log('✅ [AuthInterceptor] Constructor called - Interceptor is REGISTERED');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestCount++;
    const requestNumber = this.requestCount;
    
    console.log(`\n🔵 [AuthInterceptor #${requestNumber}] Intercepting request:`, {
      method: request.method,
      url: request.url,
      timestamp: new Date().toISOString()
    });
    
    // Get token directly from localStorage
    const token = localStorage.getItem('token');
    console.log(`🔵 [AuthInterceptor #${requestNumber}] Token check:`, {
      exists: !!token,
      length: token?.length || 0,
      preview: token ? token.substring(0, 30) + '...' : 'NONE'
    });
    
    if (token) {
      console.log(`🔵 [AuthInterceptor #${requestNumber}] ✅ Adding Authorization header with Bearer token`);
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Verify the header was set
      const headerValue = authRequest.headers.get('Authorization');
      console.log(`🔵 [AuthInterceptor #${requestNumber}] Header verification:`, {
        headerExists: !!headerValue,
        headerValue: headerValue ? headerValue.substring(0, 40) + '...' : 'NOT SET'
      });
      
      return next.handle(authRequest).pipe(
        tap(() => console.log(`🔵 [AuthInterceptor #${requestNumber}] ✅ Request completed successfully`)),
        catchError((error: HttpErrorResponse) => {
          console.error(`🔵 [AuthInterceptor #${requestNumber}] ❌ Request error:`, {
            status: error.status,
            statusText: error.statusText,
            message: error.message
          });
          return throwError(() => error);
        })
      );
    } else {
      console.warn(`🔵 [AuthInterceptor #${requestNumber}] ⚠️  NO TOKEN IN LOCALSTORAGE - Request will fail if endpoint requires auth`);
      return next.handle(request).pipe(
        tap(() => console.log(`🔵 [AuthInterceptor #${requestNumber}] Request completed (without auth)`)),
        catchError((error: HttpErrorResponse) => {
          console.error(`🔵 [AuthInterceptor #${requestNumber}] ❌ Request error:`, {
            status: error.status,
            statusText: error.statusText,
            message: error.message
          });
          if (error.status === 401) {
            console.error(`🔵 [AuthInterceptor #${requestNumber}] 🔐 Got 401 Unauthorized - Token missing or expired`);
          }
          return throwError(() => error);
        })
      );
    }
  }
}
