import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, AuthResponse, ApiResponse } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  register(name: string, email: string, password: string, role: string, contact_info?: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
      role,
      contact_info
    });
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.data) {
          console.log('Login successful, storing token');
          localStorage.setItem('token', response.data.token);
          console.log('Token stored:', response.data.token.substring(0, 20) + '...');
          this.userSubject.next(response.data.user);
          console.log('User set:', response.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/profile`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('getToken() called - Token exists:', !!token);
    return token;
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  private loadUser(): void {
    if (this.isLoggedIn()) {
      this.getProfile().subscribe(
        response => {
          if (response.data) {
            this.userSubject.next(response.data);
          }
        },
        error => {
          this.logout();
        }
      );
    }
  }
}
