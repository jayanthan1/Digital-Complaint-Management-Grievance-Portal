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
import { MatRippleModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-register',
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
    MatRippleModule,
    MatStepperModule
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
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
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
              <mat-icon>how_to_reg</mat-icon>
            </div>
            <h1>Join Our Platform</h1>
            <p>Create an account to start managing your complaints efficiently</p>
            
            <div class="benefits-list">
              <div class="benefit-item" *ngFor="let benefit of benefits; let i = index" [style.animation-delay]="i * 100 + 'ms'">
                <div class="benefit-icon">
                  <mat-icon>{{ benefit.icon }}</mat-icon>
                </div>
                <div class="benefit-text">
                  <h4>{{ benefit.title }}</h4>
                  <p>{{ benefit.description }}</p>
                </div>
              </div>
            </div>

            <div class="trust-badges">
              <div class="badge">
                <mat-icon>verified_user</mat-icon>
                <span>Secure</span>
              </div>
              <div class="badge">
                <mat-icon>speed</mat-icon>
                <span>Fast</span>
              </div>
              <div class="badge">
                <mat-icon>support_agent</mat-icon>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Registration Form -->
        <div class="auth-form-container" @fadeInUp>
          <div class="auth-card" [@shake]="shakeState">
            <!-- Progress Indicator -->
            <div class="progress-steps">
              <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
                <div class="step-number">
                  <mat-icon *ngIf="currentStep > 1">check</mat-icon>
                  <span *ngIf="currentStep <= 1">1</span>
                </div>
                <span class="step-label">Account</span>
              </div>
              <div class="step-line" [class.active]="currentStep > 1"></div>
              <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
                <div class="step-number">
                  <mat-icon *ngIf="currentStep > 2">check</mat-icon>
                  <span *ngIf="currentStep <= 2">2</span>
                </div>
                <span class="step-label">Security</span>
              </div>
              <div class="step-line" [class.active]="currentStep > 2"></div>
              <div class="step" [class.active]="currentStep >= 3">
                <div class="step-number">3</div>
                <span class="step-label">Profile</span>
              </div>
            </div>

            <!-- Card Header -->
            <div class="card-header">
              <div class="header-icon" @scaleIn>
                <mat-icon>{{ getStepIcon() }}</mat-icon>
                <div class="icon-ring"></div>
              </div>
              <h2>{{ getStepTitle() }}</h2>
              <p>{{ getStepSubtitle() }}</p>
            </div>

            <!-- Registration Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
              
              <!-- Step 1: Account Details -->
              <div class="form-step" *ngIf="currentStep === 1" @slideIn>
                <!-- Full Name Field -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>person</mat-icon>
                    Full Name
                  </label>
                  <div class="input-wrapper" 
                       [class.focused]="nameFocused" 
                       [class.has-value]="registerForm.get('name')?.value"
                       [class.has-error]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
                    <input 
                      type="text" 
                      formControlName="name"
                      placeholder="Enter your full name"
                      (focus)="nameFocused = true"
                      (blur)="nameFocused = false"
                    >
                    <div class="input-icon">
                      <mat-icon>badge</mat-icon>
                    </div>
                    <div class="input-border"></div>
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Full name is required
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('name')?.hasError('minlength') && registerForm.get('name')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Name must be at least 2 characters
                  </div>
                </div>

                <!-- Email Field -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>email</mat-icon>
                    Email Address
                  </label>
                  <div class="input-wrapper" 
                       [class.focused]="emailFocused" 
                       [class.has-value]="registerForm.get('email')?.value"
                       [class.has-error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
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
                  <div class="error-message" *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Email is required
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Please enter a valid email
                  </div>
                </div>
              </div>

              <!-- Step 2: Security -->
              <div class="form-step" *ngIf="currentStep === 2" @slideIn>
                <!-- Password Field -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>lock</mat-icon>
                    Password
                  </label>
                  <div class="input-wrapper" 
                       [class.focused]="passwordFocused" 
                       [class.has-value]="registerForm.get('password')?.value"
                       [class.has-error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                    <input 
                      [type]="hidePassword ? 'password' : 'text'" 
                      formControlName="password"
                      placeholder="Create a strong password"
                      (focus)="passwordFocused = true"
                      (blur)="passwordFocused = false"
                    >
                    <button type="button" class="toggle-password" (click)="hidePassword = !hidePassword" matRipple>
                      <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <div class="input-border"></div>
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Password is required
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Password must be at least 6 characters
                  </div>
                  
                  <!-- Password Strength Indicator -->
                  <div class="password-strength" *ngIf="registerForm.get('password')?.value">
                    <div class="strength-bars">
                      <div class="bar" [class.active]="passwordStrength >= 1" [class.weak]="passwordStrength === 1" [class.medium]="passwordStrength === 2" [class.strong]="passwordStrength >= 3"></div>
                      <div class="bar" [class.active]="passwordStrength >= 2" [class.medium]="passwordStrength === 2" [class.strong]="passwordStrength >= 3"></div>
                      <div class="bar" [class.active]="passwordStrength >= 3" [class.strong]="passwordStrength >= 3"></div>
                      <div class="bar" [class.active]="passwordStrength >= 4" [class.strong]="passwordStrength >= 4"></div>
                    </div>
                    <span class="strength-text" [class.weak]="passwordStrength === 1" [class.medium]="passwordStrength === 2" [class.strong]="passwordStrength >= 3">
                      {{ getPasswordStrengthText() }}
                    </span>
                  </div>
                </div>

                <!-- Confirm Password Field -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>lock_outline</mat-icon>
                    Confirm Password
                  </label>
                  <div class="input-wrapper" 
                       [class.focused]="confirmPasswordFocused" 
                       [class.has-value]="registerForm.get('confirmPassword')?.value"
                       [class.has-error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched">
                    <input 
                      [type]="hideConfirmPassword ? 'password' : 'text'" 
                      formControlName="confirmPassword"
                      placeholder="Confirm your password"
                      (focus)="confirmPasswordFocused = true"
                      (blur)="confirmPasswordFocused = false"
                    >
                    <button type="button" class="toggle-password" (click)="hideConfirmPassword = !hideConfirmPassword" matRipple>
                      <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                    <div class="input-border"></div>
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Please confirm your password
                  </div>
                  <div class="error-message" *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Passwords do not match
                  </div>
                  <div class="success-message" *ngIf="!registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.value && registerForm.get('password')?.value">
                    <mat-icon>check_circle</mat-icon>
                    Passwords match
                  </div>
                </div>
              </div>

              <!-- Step 3: Profile -->
              <div class="form-step" *ngIf="currentStep === 3" @slideIn>
                <!-- Role Selection -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>work</mat-icon>
                    Select Your Role
                  </label>
                  <div class="role-cards">
                    <div class="role-card" 
                         *ngFor="let role of roles"
                         [class.selected]="registerForm.get('role')?.value === role.value"
                         (click)="selectRole(role.value)">
                      <div class="role-icon" [style.background]="role.gradient">
                        <mat-icon>{{ role.icon }}</mat-icon>
                      </div>
                      <div class="role-info">
                        <h4>{{ role.label }}</h4>
                        <p>{{ role.description }}</p>
                      </div>
                      <div class="role-check">
                        <mat-icon>check_circle</mat-icon>
                      </div>
                    </div>
                  </div>
                  <div class="error-message" *ngIf="registerForm.get('role')?.hasError('required') && registerForm.get('role')?.touched">
                    <mat-icon>error_outline</mat-icon>
                    Please select a role
                  </div>
                </div>

                <!-- Contact Info Field -->
                <div class="form-group">
                  <label class="form-label">
                    <mat-icon>phone</mat-icon>
                    Contact Number
                    <span class="optional-tag">Optional</span>
                  </label>
                  <div class="input-wrapper" 
                       [class.focused]="contactFocused" 
                       [class.has-value]="registerForm.get('contact_info')?.value">
                    <input 
                      type="tel" 
                      formControlName="contact_info"
                      placeholder="Enter your contact number"
                      (focus)="contactFocused = true"
                      (blur)="contactFocused = false"
                    >
                    <div class="input-icon">
                      <mat-icon>smartphone</mat-icon>
                    </div>
                    <div class="input-border"></div>
                  </div>
                </div>

                <!-- Terms Agreement -->
                <div class="terms-agreement">
                  <label class="checkbox-wrapper">
                    <input type="checkbox" [checked]="agreeToTerms" (change)="agreeToTerms = !agreeToTerms">
                    <span class="checkmark"></span>
                    <span class="terms-text">
                      I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                    </span>
                  </label>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn-secondary"
                  *ngIf="currentStep > 1"
                  (click)="previousStep()"
                  matRipple>
                  <mat-icon>arrow_back</mat-icon>
                  Back
                </button>
                
                <button 
                  type="button" 
                  class="btn-primary"
                  *ngIf="currentStep < 3"
                  (click)="nextStep()"
                  [disabled]="!isCurrentStepValid()"
                  matRipple>
                  Continue
                  <mat-icon>arrow_forward</mat-icon>
                </button>

                <button 
                  type="submit" 
                  class="btn-primary submit-btn"
                  *ngIf="currentStep === 3"
                  [class.loading]="isLoading"
                  [disabled]="!registerForm.valid || isLoading || !agreeToTerms"
                  matRipple>
                  <span class="btn-content" *ngIf="!isLoading">
                    <mat-icon>how_to_reg</mat-icon>
                    Create Account
                  </span>
                  <span class="btn-loader" *ngIf="isLoading">
                    <div class="spinner"></div>
                    Creating...
                  </span>
                </button>
              </div>

              <!-- Social Registration -->
              <div class="social-divider" *ngIf="currentStep === 1">
                <span>or register with</span>
              </div>

              <div class="social-buttons" *ngIf="currentStep === 1">
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

            <!-- Login Link -->
            <div class="auth-footer">
              <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
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
      --success-light: #d1fae5;
      --warning: #f59e0b;
      --warning-light: #fef3c7;
      --danger: #ef4444;
      --danger-light: #fee2e2;
      --info: #3b82f6;
      
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
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
      right: -200px;
      animation: float-slow 20s ease-in-out infinite;
    }

    .sphere-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%);
      bottom: -150px;
      left: -150px;
      animation: float-slow 15s ease-in-out infinite reverse;
    }

    .sphere-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 30%;
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
      max-width: 1300px;
      min-height: 750px;
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
      max-width: 480px;
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

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 48px;
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      animation: fadeInLeft 0.5s ease-out forwards;
      opacity: 0;
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .benefit-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .benefit-icon mat-icon {
      color: var(--primary-light);
    }

    .benefit-text h4 {
      margin: 0 0 4px;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-light);
    }

    .benefit-text p {
      margin: 0;
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .trust-badges {
      display: flex;
      gap: 24px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--success);
    }

    /* ==================== Form Container ==================== */
    .auth-form-container {
      flex: 1.2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .auth-card {
      width: 100%;
      max-width: 500px;
      background: var(--bg-card);
      border-radius: var(--border-radius-xl);
      padding: 40px;
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

    /* ==================== Progress Steps ==================== */
    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .step-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-muted);
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: var(--gradient-primary);
      border-color: var(--primary);
      color: white;
    }

    .step.completed .step-number {
      background: var(--gradient-success);
      border-color: var(--success);
      color: white;
    }

    .step-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .step.active .step-label {
      color: var(--primary);
    }

    .step.completed .step-label {
      color: var(--success);
    }

    .step-line {
      width: 60px;
      height: 3px;
      background: var(--border-color);
      margin: 0 12px 24px;
      border-radius: 2px;
      transition: background 0.3s ease;
    }

    .step-line.active {
      background: var(--gradient-success);
    }

    /* ==================== Card Header ==================== */
    .card-header {
      text-align: center;
      margin-bottom: 32px;
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
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .card-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    /* ==================== Form Styles ==================== */
    .register-form {
      display: flex;
      flex-direction: column;
    }

    .form-step {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .optional-tag {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-muted);
      background: var(--bg-input);
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: auto;
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
      background: var(--danger-light);
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

    .success-message {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--success);
    }

    .success-message mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @keyframes shake-error {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    /* ==================== Password Strength ==================== */
    .password-strength {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
    }

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    .strength-bars .bar {
      height: 4px;
      flex: 1;
      background: var(--border-color);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .strength-bars .bar.active.weak {
      background: var(--danger);
    }

    .strength-bars .bar.active.medium {
      background: var(--warning);
    }

    .strength-bars .bar.active.strong {
      background: var(--success);
    }

    .strength-text {
      font-size: 0.75rem;
      font-weight: 600;
    }

    .strength-text.weak { color: var(--danger); }
    .strength-text.medium { color: var(--warning); }
    .strength-text.strong { color: var(--success); }

    /* ==================== Role Cards ==================== */
    .role-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .role-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      background: white;
    }

    .role-card:hover {
      border-color: var(--primary-light);
      background: rgba(102, 126, 234, 0.02);
    }

    .role-card.selected {
      border-color: var(--primary);
      background: rgba(102, 126, 234, 0.05);
    }

    .role-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .role-icon mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .role-info {
      flex: 1;
    }

    .role-info h4 {
      margin: 0 0 4px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .role-info p {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .role-check {
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s ease;
    }

    .role-card.selected .role-check {
      opacity: 1;
      transform: scale(1);
    }

    .role-check mat-icon {
      color: var(--success);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    /* ==================== Terms Agreement ==================== */
    .terms-agreement {
      margin-top: 8px;
    }

    .checkbox-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      position: relative;
      padding-left: 32px;
    }

    .checkbox-wrapper input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
    }

    .checkmark {
      position: absolute;
      left: 0;
      top: 2px;
      width: 22px;
      height: 22px;
      border: 2px solid var(--border-color);
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .checkbox-wrapper input:checked ~ .checkmark {
      background: var(--gradient-primary);
      border-color: var(--primary);
    }

    .checkmark::after {
      content: '';
      position: absolute;
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .checkbox-wrapper input:checked ~ .checkmark::after {
      opacity: 1;
    }

    .terms-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .terms-text a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    .terms-text a:hover {
      text-decoration: underline;
    }

    /* ==================== Form Actions ==================== */
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;
    }

    .btn-secondary {
      flex: 1;
      height: 52px;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      background: white;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: rgba(102, 126, 234, 0.05);
    }

    .btn-primary {
      flex: 2;
      height: 52px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--gradient-primary);
      color: white;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-loader {
      display: flex;
      align-items: center;
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
      margin: 24px 0;
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

    /* ==================== Responsive ==================== */
    @media (max-width: 1024px) {
      .auth-content {
        flex-direction: column;
        max-width: 550px;
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

      .benefits-list {
        display: none;
      }

      .trust-badges {
        justify-content: center;
      }

      .auth-form-container {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 28px 20px;
      }

      .progress-steps {
        transform: scale(0.9);
      }

      .step-line {
        width: 40px;
      }

      .card-header h2 {
        font-size: 1.25rem;
      }

      .social-buttons {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn-secondary, .btn-primary {
        flex: none;
        width: 100%;
      }

      .role-card {
        padding: 12px;
      }

      .role-icon {
        width: 40px;
        height: 40px;
      }

      .trust-badges {
        flex-wrap: wrap;
        gap: 12px;
      }

      .badge {
        padding: 8px 12px;
        font-size: 0.75rem;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  currentStep = 1;
  agreeToTerms = false;
  shakeState = '';

  // Focus states
  nameFocused = false;
  emailFocused = false;
  passwordFocused = false;
  confirmPasswordFocused = false;
  contactFocused = false;

  shapes = [
    { left: '5%', top: '15%', delay: '0s', size: '50px' },
    { left: '85%', top: '20%', delay: '2s', size: '40px' },
    { left: '75%', top: '75%', delay: '4s', size: '55px' },
    { left: '15%', top: '85%', delay: '1s', size: '35px' },
    { left: '92%', top: '55%', delay: '3s', size: '45px' },
    { left: '8%', top: '50%', delay: '5s', size: '30px' },
  ];

  benefits = [
    { icon: 'flash_on', title: 'Quick Registration', description: 'Get started in less than 2 minutes' },
    { icon: 'security', title: 'Secure & Private', description: 'Your data is encrypted and safe' },
    { icon: 'track_changes', title: 'Real-time Updates', description: 'Track your complaints instantly' },
    { icon: 'support_agent', title: 'Expert Support', description: 'Dedicated team to assist you' }
  ];

  roles = [
    { 
      value: 'user', 
      label: 'Citizen / User', 
      description: 'File and track complaints',
      icon: 'person',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      value: 'staff', 
      label: 'Staff / Technician', 
      description: 'Handle assigned complaints',
      icon: 'engineering',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      value: 'admin', 
      label: 'Administrator', 
      description: 'Manage entire system',
      icon: 'admin_panel_settings',
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]],
      contact_info: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  get passwordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Too Short';
    }
  }

  getStepIcon(): string {
    switch (this.currentStep) {
      case 1: return 'person_add';
      case 2: return 'lock';
      case 3: return 'badge';
      default: return 'person_add';
    }
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 1: return 'Account Details';
      case 2: return 'Create Password';
      case 3: return 'Complete Profile';
      default: return 'Account Details';
    }
  }

  getStepSubtitle(): string {
    switch (this.currentStep) {
      case 1: return 'Enter your name and email to get started';
      case 2: return 'Create a secure password for your account';
      case 3: return 'Select your role and finalize registration';
      default: return '';
    }
  }

  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.registerForm.get('name')?.valid && this.registerForm.get('email')?.valid || false;
      case 2:
        return this.registerForm.get('password')?.valid && 
               this.registerForm.get('confirmPassword')?.valid &&
               !this.registerForm.hasError('passwordMismatch') || false;
      case 3:
        return this.registerForm.get('role')?.valid && this.agreeToTerms || false;
      default:
        return false;
    }
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  selectRole(role: string): void {
    this.registerForm.patchValue({ role });
  }

  onSubmit(): void {
    if (this.registerForm.valid && this.agreeToTerms) {
      this.isLoading = true;
      const { name, email, password, role, contact_info } = this.registerForm.value;

      this.authService.register(name, email, password, role, contact_info).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('🎉 Registration successful! Please login.', 'Close', { 
              duration: 4000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/auth/login']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.shakeState = 'invalid';
          setTimeout(() => this.shakeState = '', 500);
          const errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open('❌ ' + errorMessage, 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}