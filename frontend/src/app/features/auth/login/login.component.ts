import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../../../core/services/auth.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,  
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatCheckboxModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(40px)' }),
        animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('shake', [
      state('invalid', style({ transform: 'translateX(0)' })),
      transition('* => invalid', [
        animate('0.4s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="auth-container">
      <!-- Animated Background -->
      <div class="bg-decoration">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="gradient-sphere sphere-3"></div>
        <div class="floating-shapes">
          <span *ngFor="let shape of shapes" 
                [style.left]="shape.left" 
                [style.top]="shape.top"
                [style.animation-delay]="shape.delay"
                [style.width]="shape.size"
                [style.height]="shape.size">
          </span>
        </div>
      </div>

      <!-- Main Content -->
      <div class="auth-content">
        <!-- Left Side - Branding -->
        <div class="auth-branding" @fadeIn>
          <div class="brand-content">
            <div class="brand-icon">
              <mat-icon>support_agent</mat-icon>
            </div>
            <h1>Complaint Management System</h1>
            <p>Streamline your complaint handling process with our powerful platform</p>
            
            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>speed</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Fast Resolution</h4>
                  <p>Quick and efficient complaint handling</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>track_changes</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Real-time Tracking</h4>
                  <p>Monitor your complaints in real-time</p>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>notifications_active</mat-icon>
                </div>
                <div class="feature-text">
                  <h4>Instant Updates</h4>
                  <p>Get notified on status changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="auth-form-container" @fadeInUp>
          <div class="auth-card" [@shake]="shakeState">
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-icon" @scaleIn>
                <mat-icon>lock_open</mat-icon>
                <div class="icon-ring"></div>
              </div>
              <h2>Welcome Back</h2>
              <p>Sign in to continue to your account</p>
            </div>

            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <!-- Email Field -->
              <div class="form-group">
                <label class="form-label">
                  <mat-icon>email</mat-icon>
                  Email Address
                </label>
                <div class="input-wrapper" [class.focused]="emailFocused" [class.has-value]="loginForm.get('email')?.value" [class.has-error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                  <input 
                    type="email" 
                    formControlName="email"
                    placeholder="Enter your email"
                    (focus)="emailFocused = true"
                    (blur)="emailFocused = false"
                  >
                  <div class="input-icon">
                    <mat-icon>alternate_email</mat-icon>
                  </div>
                  <div class="input-border"></div>
                </div>
                <div class="error-message" *ngIf="loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched">
                  <mat-icon>error_outline</mat-icon>
                  Email is required
                </div>
                <div class="error-message" *ngIf="loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched">
                  <mat-icon>error_outline</mat-icon>
                  Please enter a valid email
                </div>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label class="form-label">
                  <mat-icon>lock</mat-icon>
                  Password
                </label>
                <div class="input-wrapper" [class.focused]="passwordFocused" [class.has-value]="loginForm.get('password')?.value" [class.has-error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <input 
                    [type]="hidePassword ? 'password' : 'text'" 
                    formControlName="password"
                    placeholder="Enter your password"
                    (focus)="passwordFocused = true"
                    (blur)="passwordFocused = false"
                  >
                  <button type="button" class="toggle-password" (click)="hidePassword = !hidePassword" matRipple>
                    <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <div class="input-border"></div>
                </div>
                <div class="error-message" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
                  <mat-icon>error_outline</mat-icon>
                  Password is required
                </div>
              </div>

              <!-- Remember Me & Forgot Password -->
              <div class="form-options">
                <label class="remember-me">
                  <input type="checkbox" [(ngModel)]="rememberMe" [ngModelOptions]="{standalone: true}">
                  <span class="checkmark"></span>
                  Remember me
                </label>
                <a href="#" class="forgot-link">Forgot Password?</a>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="submit-btn"
                [class.loading]="isLoading"
                [disabled]="loginForm.invalid || isLoading"
                matRipple
              >
                <span class="btn-content" *ngIf="!isLoading">
                  <mat-icon>login</mat-icon>
                  Sign In
                </span>
                <span class="btn-loader" *ngIf="isLoading">
                  <div class="spinner"></div>
                  Signing in...
                </span>
              </button>

              <!-- Social Login -->
              <div class="social-divider">
                <span>or continue with</span>
              </div>

              <div class="social-buttons">
                <button type="button" class="social-btn google" matRipple>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" class="social-btn microsoft" matRipple>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  Microsoft
                </button>
              </div>
            </form>

            <!-- Register Link -->
            <div class="auth-footer">
              <p>Don't have an account? <a routerLink="/auth/register">Create Account</a></p>
            </div>

            <!-- Demo Credentials -->
            <div class="demo-box">
              <div class="demo-header">
                <mat-icon>info</mat-icon>
                <span>Demo Credentials</span>
              </div>
              <div class="demo-content">
                <div class="demo-item" (click)="fillDemoCredentials('citizen')">
                  <div class="demo-role">
                    <mat-icon>person</mat-icon>
                    Citizen
                  </div>
                  <div class="demo-creds">
                    <span>john&#64;example.com</span>
                    <span>password123</span>
                  </div>
                </div>
                <div class="demo-item" (click)="fillDemoCredentials('staff')">
                  <div class="demo-role">
                    <mat-icon>engineering</mat-icon>
                    Staff
                  </div>
                  <div class="demo-creds">
                    <span>staff&#64;example.com</span>
                    <span>password123</span>
                  </div>
                </div>
                <div class="demo-item" (click)="fillDemoCredentials('admin')">
                  <div class="demo-role">
                    <mat-icon>admin_panel_settings</mat-icon>
                    Admin
                  </div>
                  <div class="demo-creds">
                    <span>admin&#64;example.com</span>
                    <span>password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ==================== CSS Variables ==================== */
    :host {
      --primary: #667eea;
      --primary-dark: #5a67d8;
      --primary-light: #a3bffa;
      --secondary: #764ba2;
      --accent: #f093fb;
      
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --info: #3b82f6;
      
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --gradient-dark: linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%);
      
      --bg-dark: #0f0f1a;
      --bg-card: #ffffff;
      --bg-input: #f8fafc;
      
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --text-light: #ffffff;
      
      --border-color: #e2e8f0;
      --border-radius-sm: 8px;
      --border-radius-md: 12px;
      --border-radius-lg: 16px;
      --border-radius-xl: 24px;
      --border-radius-full: 50%;
      
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.3);
    }

    /* ==================== Container ==================== */
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-dark);
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    /* ==================== Background Decoration ==================== */
    .bg-decoration {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .gradient-sphere {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }

    .sphere-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
      animation: float-slow 20s ease-in-out infinite;
    }

    .sphere-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      animation: float-slow 15s ease-in-out infinite reverse;
    }

    .sphere-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-glow 8s ease-in-out infinite;
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-50px) rotate(10deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
    }

    .floating-shapes {
      position: absolute;
      inset: 0;
    }

    .floating-shapes span {
      position: absolute;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--border-radius-sm);
      animation: float-shape 15s ease-in-out infinite;
    }

    @keyframes float-shape {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
      50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
    }

    /* ==================== Main Content ==================== */
    .auth-content {
      display: flex;
      width: 100%;
      max-width: 1200px;
      min-height: 700px;
      position: relative;
      z-index: 1;
    }

    /* ==================== Branding Section ==================== */
    .auth-branding {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--text-light);
    }

    .brand-content {
      max-width: 450px;
    }

    .brand-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--text-light);
    }

    .brand-content h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 16px;
      line-height: 1.2;
      background: linear-gradient(135deg, #fff 0%, #a3bffa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-content > p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0 0 48px;
      line-height: 1.6;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-icon mat-icon {
      color: var(--primary-light);
    }

    .feature-text h4 {
      margin: 0 0 4px;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-light);
    }

    .feature-text p {
      margin: 0;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    /* ==================== Form Container ==================== */
    .auth-form-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background: var(--bg-card);
      border-radius: var(--border-radius-xl);
      padding: 48px 40px;
      box-shadow: var(--shadow-2xl), var(--shadow-glow);
      position: relative;
      overflow: hidden;
    }

    .auth-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
    }

    /* ==================== Card Header ==================== */
    .card-header {
      text-align: center;
      margin-bottom: 36px;
    }

    .header-icon {
      width: 72px;
      height: 72px;
      background: var(--gradient-primary);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      position: relative;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .header-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .icon-ring {
      position: absolute;
      inset: -8px;
      border: 2px dashed rgba(102, 126, 234, 0.3);
      border-radius: var(--border-radius-full);
      animation: spin-slow 20s linear infinite;
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .card-header h2 {
      margin: 0 0 8px;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* ==================== Form Styles ==================== */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-label mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary);
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper input {
      width: 100%;
      height: 52px;
      padding: 0 48px 0 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      font-size: 1rem;
      color: var(--text-primary);
      background: var(--bg-input);
      transition: all 0.3s ease;
      outline: none;
    }

    .input-wrapper input::placeholder {
      color: var(--text-muted);
    }

    .input-wrapper.focused input,
    .input-wrapper.has-value input {
      border-color: var(--primary);
      background: white;
    }

    .input-wrapper.has-error input {
      border-color: var(--danger);
      background: #fef2f2;
    }

    .input-wrapper .input-icon {
      position: absolute;
      right: 16px;
      color: var(--text-muted);
      pointer-events: none;
      transition: color 0.3s ease;
    }

    .input-wrapper.focused .input-icon {
      color: var(--primary);
    }

    .input-wrapper .input-icon mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .toggle-password {
      position: absolute;
      right: 8px;
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .toggle-password:hover {
      background: var(--bg-input);
      color: var(--primary);
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: all 0.3s ease;
      transform: translateX(-50%);
    }

    .input-wrapper.focused .input-border {
      width: 100%;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--danger);
      animation: shake-error 0.4s ease;
    }

    .error-message mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @keyframes shake-error {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* ==================== Form Options ==================== */
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -8px;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--text-secondary);
      position: relative;
      padding-left: 28px;
    }

    .remember-me input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkmark {
      position: absolute;
      left: 0;
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-color);
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .remember-me input:checked ~ .checkmark {
      background: var(--gradient-primary);
      border-color: var(--primary);
    }

    .checkmark::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .remember-me input:checked ~ .checkmark::after {
      opacity: 1;
    }

    .forgot-link {
      font-size: 0.875rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    /* ==================== Submit Button ==================== */
    .submit-btn {
      width: 100%;
      height: 54px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--gradient-primary);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }

    .submit-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .btn-loader {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ==================== Social Login ==================== */
    .social-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 8px 0;
    }

    .social-divider::before,
    .social-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color);
    }

    .social-divider span {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .social-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .social-btn {
      height: 46px;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      border-color: var(--primary);
      background: var(--bg-input);
    }

    /* ==================== Auth Footer ==================== */
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    .auth-footer p {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .auth-footer a {
      color: var(--primary);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .auth-footer a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    /* ==================== Demo Box ==================== */
    .demo-box {
      margin-top: 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: var(--border-radius-md);
      overflow: hidden;
      border: 1px solid var(--border-color);
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--gradient-primary);
      color: white;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .demo-header mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .demo-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .demo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }

    .demo-item:hover {
      background: var(--bg-input);
    }

    .demo-item:not(:last-child) {
      border-bottom: 1px solid var(--border-color);
    }

    .demo-role {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    .demo-role mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary);
    }

    .demo-creds {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: 'Monaco', 'Consolas', monospace;
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 1024px) {
      .auth-content {
        flex-direction: column;
        max-width: 500px;
      }

      .auth-branding {
        padding: 40px 20px;
        text-align: center;
      }

      .brand-content {
        max-width: 100%;
      }

      .brand-icon {
        margin: 0 auto 24px;
      }

      .brand-content h1 {
        font-size: 1.75rem;
      }

      .features-list {
        display: none;
      }

      .auth-form-container {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 32px 24px;
      }

      .card-header h2 {
        font-size: 1.5rem;
      }

      .social-buttons {
        grid-template-columns: 1fr;
      }

      .form-options {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .demo-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .demo-creds {
        align-items: flex-start;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  rememberMe = false;
  emailFocused = false;
  passwordFocused = false;
  shakeState = '';

  shapes = [
    { left: '10%', top: '20%', delay: '0s', size: '60px' },
    { left: '80%', top: '15%', delay: '2s', size: '40px' },
    { left: '70%', top: '70%', delay: '4s', size: '50px' },
    { left: '20%', top: '80%', delay: '1s', size: '35px' },
    { left: '90%', top: '50%', delay: '3s', size: '45px' },
    { left: '5%', top: '50%', delay: '5s', size: '30px' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.shakeState = 'invalid';
      setTimeout(() => this.shakeState = '', 500);
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    console.log('=== Login Form Submit ===');
    console.log('Email:', email);
    console.log('Current token before login:', localStorage.getItem('token') ? 'EXISTS' : 'NOT EXISTS');
    
    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('=== Login Response Received ===');
        console.log('Response success:', res.success);
        console.log('Response data:', res.data);
        console.log('User role:', res.data?.user?.role);
        
        const tokenAfterLogin = localStorage.getItem('token');
        console.log('Token after login:', tokenAfterLogin ? 'EXISTS (length: ' + tokenAfterLogin.length + ')' : 'NOT EXISTS');
        
        if (res.success) {
          this.snackBar.open('🎉 Login successful! Welcome back.', 'Close', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Redirect based on user role
          const userRole = res.data?.user?.role;
          let redirectPath = '/complaints'; // Default for user
          
          if (userRole === 'admin') {
            redirectPath = '/admin/dashboard';
          } else if (userRole === 'staff') {
            redirectPath = '/staff/dashboard';
          }
          
          console.log('Navigating to:', redirectPath);
          this.router.navigate([redirectPath]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.shakeState = 'invalid';
        setTimeout(() => this.shakeState = '', 500);
        console.error('=== Login Error ===');
        console.error('Error:', err);
        this.snackBar.open(
          err.error?.message || '❌ Login failed. Please check your credentials.',
          'Close',
          { 
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      },
      complete: () => this.isLoading = false
    });
  }

  fillDemoCredentials(role: 'citizen' | 'staff' | 'admin'): void {
    const credentials: Record<string, { email: string; password: string }> = {
      citizen: { email: 'john@example.com', password: 'password123' },
      staff: { email: 'staff@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' }
    };

    this.loginForm.patchValue(credentials[role]);
    this.snackBar.open(`✅ ${role.charAt(0).toUpperCase() + role.slice(1)} credentials filled!`, 'Close', {
      duration: 2000
    });
  }
}