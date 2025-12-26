import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule
  ],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]),
    trigger('fadeOverlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('200ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(1)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'scale(0.95)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="app-wrapper">
      <!-- Enhanced Navbar -->
      <header class="navbar" @slideDown [class.scrolled]="isScrolled">
        <div class="navbar-container">
          <!-- Logo & Brand -->
          <a class="brand" routerLink="/">
            <div class="brand-logo">
              <mat-icon>support_agent</mat-icon>
              <div class="logo-pulse"></div>
            </div>
            <div class="brand-text">
              <span class="brand-name">ComplaintHub</span>
              <span class="brand-tagline">Resolution Center</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="nav-desktop" *ngIf="user$ | async as user">
            <a class="nav-item" 
               *ngIf="user.role === 'user'"
               routerLink="/complaints" 
               routerLinkActive="active">
              <mat-icon>inbox</mat-icon>
              <span>My Complaints</span>
              <div class="nav-indicator"></div>
            </a>

            <a class="nav-item" 
               *ngIf="user.role === 'staff'"
               routerLink="/staff/dashboard" 
               routerLinkActive="active">
              <mat-icon>assignment</mat-icon>
              <span>Assignments</span>
              <span class="nav-badge" *ngIf="assignedCount > 0">{{ assignedCount }}</span>
              <div class="nav-indicator"></div>
            </a>

            <a class="nav-item" 
               *ngIf="user.role === 'admin'"
               routerLink="/admin/dashboard" 
               routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
              <div class="nav-indicator"></div>
            </a>

            <button class="nav-cta" *ngIf="user.role === 'user'" routerLink="/complaints/new">
              <mat-icon>add</mat-icon>
              <span>New Complaint</span>
            </button>
          </nav>

          <!-- Right Section -->
          <div class="nav-right" *ngIf="user$ | async as user">
            <!-- Notifications -->
            <button class="icon-btn notification-btn" matTooltip="Notifications">
              <mat-icon>notifications_none</mat-icon>
              <span class="notification-dot"></span>
            </button>

            <!-- Profile Trigger -->
            <button class="profile-trigger" (click)="toggleProfile()">
              <div class="profile-avatar">
                <span class="avatar-text">{{ getInitials(user.name) }}</span>
                <div class="status-indicator online"></div>
              </div>
              <div class="profile-info">
                <span class="profile-name">{{ user.name }}</span>
                <span class="profile-role">{{ user.role | titlecase }}</span>
              </div>
              <mat-icon class="chevron" [class.rotated]="isProfileOpen">keyboard_arrow_down</mat-icon>
            </button>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-toggle" (click)="toggleMobileMenu()">
              <span class="hamburger" [class.active]="isMobileMenuOpen">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        <!-- Desktop Profile Dropdown -->
        <div class="profile-dropdown" 
             *ngIf="isProfileOpen && !isMobile" 
             @scaleIn
             (click)="$event.stopPropagation()">
          <div class="dropdown-header" *ngIf="user$ | async as user">
            <div class="dropdown-avatar">
              <span>{{ getInitials(user.name) }}</span>
            </div>
            <div class="dropdown-user-info">
              <h4>{{ user.name }}</h4>
              <p>{{ user.email }}</p>
              <span class="role-chip" [attr.data-role]="user.role">
                <mat-icon>{{ getRoleIcon(user.role) }}</mat-icon>
                {{ user.role | titlecase }}
              </span>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <div class="dropdown-menu">
            <a class="dropdown-item" routerLink="/profile" (click)="closeProfile()">
              <div class="item-icon">
                <mat-icon>person_outline</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-title">My Profile</span>
                <span class="item-desc">View and edit your profile</span>
              </div>
              <mat-icon class="item-arrow">chevron_right</mat-icon>
            </a>

            <a class="dropdown-item" routerLink="/settings" (click)="closeProfile()">
              <div class="item-icon">
                <mat-icon>settings_outlined</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-title">Settings</span>
                <span class="item-desc">Preferences & configuration</span>
              </div>
              <mat-icon class="item-arrow">chevron_right</mat-icon>
            </a>

            <a class="dropdown-item" routerLink="/help" (click)="closeProfile()">
              <div class="item-icon">
                <mat-icon>help_outline</mat-icon>
              </div>
              <div class="item-content">
                <span class="item-title">Help Center</span>
                <span class="item-desc">FAQs & support</span>
              </div>
              <mat-icon class="item-arrow">chevron_right</mat-icon>
            </a>
          </div>

          <div class="dropdown-divider"></div>

          <div class="dropdown-footer">
            <button class="logout-btn" (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" 
           *ngIf="isMobileMenuOpen" 
           @fadeOverlay
           (click)="closeMobileMenu()">
      </div>

      <!-- Mobile Slide Menu -->
      <div class="mobile-menu" 
           *ngIf="isMobileMenuOpen" 
           @slideUp
           (click)="$event.stopPropagation()">
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">Menu</span>
          <button class="close-btn" (click)="closeMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <nav class="mobile-nav" *ngIf="user$ | async as user">
          <a class="mobile-nav-item" 
             *ngIf="user.role === 'user'"
             routerLink="/complaints" 
             (click)="closeMobileMenu()">
            <div class="mobile-nav-icon">
              <mat-icon>inbox</mat-icon>
            </div>
            <span>My Complaints</span>
            <mat-icon class="nav-arrow">chevron_right</mat-icon>
          </a>

          <a class="mobile-nav-item" 
             *ngIf="user.role === 'staff'"
             routerLink="/staff/dashboard" 
             (click)="closeMobileMenu()">
            <div class="mobile-nav-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <span>Assignments</span>
            <span class="mobile-badge" *ngIf="assignedCount > 0">{{ assignedCount }}</span>
            <mat-icon class="nav-arrow">chevron_right</mat-icon>
          </a>

          <a class="mobile-nav-item" 
             *ngIf="user.role === 'admin'"
             routerLink="/admin/dashboard" 
             (click)="closeMobileMenu()">
            <div class="mobile-nav-icon">
              <mat-icon>dashboard</mat-icon>
            </div>
            <span>Dashboard</span>
            <mat-icon class="nav-arrow">chevron_right</mat-icon>
          </a>

          <button class="mobile-cta" *ngIf="user.role === 'user'" routerLink="/complaints/new" (click)="closeMobileMenu()">
            <mat-icon>add_circle</mat-icon>
            <span>New Complaint</span>
          </button>
        </nav>
      </div>

      <!-- Profile Bottom Sheet (Mobile) -->
      <div class="profile-overlay" 
           *ngIf="isProfileOpen && isMobile" 
           @fadeOverlay
           (click)="closeProfile()">
      </div>

      <div class="profile-sheet" 
           *ngIf="isProfileOpen && isMobile" 
           @slideUp
           (click)="$event.stopPropagation()">
        <div class="sheet-handle"></div>
        
        <div class="sheet-header" *ngIf="user$ | async as user">
          <div class="sheet-avatar">
            <span>{{ getInitials(user.name) }}</span>
            <div class="avatar-ring"></div>
          </div>
          <div class="sheet-user-info">
            <h3>{{ user.name }}</h3>
            <p>{{ user.email }}</p>
          </div>
          <span class="sheet-role" [attr.data-role]="user.role">
            {{ user.role | titlecase }}
          </span>
        </div>

        <div class="sheet-stats" *ngIf="user$ | async as user">
          <div class="stat-item">
            <span class="stat-value">12</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">3</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">9</span>
            <span class="stat-label">Resolved</span>
          </div>
        </div>

        <div class="sheet-menu">
          <a class="sheet-menu-item" routerLink="/profile" (click)="closeProfile()">
            <div class="menu-item-icon">
              <mat-icon>person_outline</mat-icon>
            </div>
            <div class="menu-item-text">
              <span class="menu-item-title">My Profile</span>
              <span class="menu-item-subtitle">Personal information</span>
            </div>
            <mat-icon class="menu-item-arrow">chevron_right</mat-icon>
          </a>

          <a class="sheet-menu-item" routerLink="/settings" (click)="closeProfile()">
            <div class="menu-item-icon">
              <mat-icon>settings</mat-icon>
            </div>
            <div class="menu-item-text">
              <span class="menu-item-title">Settings</span>
              <span class="menu-item-subtitle">App preferences</span>
            </div>
            <mat-icon class="menu-item-arrow">chevron_right</mat-icon>
          </a>

          <a class="sheet-menu-item" routerLink="/notifications" (click)="closeProfile()">
            <div class="menu-item-icon">
              <mat-icon>notifications_none</mat-icon>
            </div>
            <div class="menu-item-text">
              <span class="menu-item-title">Notifications</span>
              <span class="menu-item-subtitle">Alerts & updates</span>
            </div>
            <mat-icon class="menu-item-arrow">chevron_right</mat-icon>
          </a>

          <a class="sheet-menu-item" routerLink="/help" (click)="closeProfile()">
            <div class="menu-item-icon">
              <mat-icon>help_outline</mat-icon>
            </div>
            <div class="menu-item-text">
              <span class="menu-item-title">Help & Support</span>
              <span class="menu-item-subtitle">Get assistance</span>
            </div>
            <mat-icon class="menu-item-arrow">chevron_right</mat-icon>
          </a>
        </div>

        <div class="sheet-footer">
          <button class="sheet-logout" (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="main-content" @fadeIn>
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-brand">
            <mat-icon>support_agent</mat-icon>
            <span>ComplaintHub</span>
          </div>
          <p class="footer-copy">© {{ currentYear }} All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Help</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* ==================== CSS Variables ==================== */
    :host {
      --navbar-height: 72px;
      --primary-color: #6366f1;
      --primary-dark: #4f46e5;
      --primary-light: #818cf8;
      --accent-color: #10b981;
      --accent-light: #34d399;
      --danger-color: #ef4444;
      --warning-color: #f59e0b;
      --bg-color: #f8fafc;
      --bg-card: #ffffff;
      --bg-elevated: #ffffff;
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
      --border-light: #f1f5f9;
      --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
      --radius-full: 9999px;
      --transition-fast: 150ms ease;
      --transition-normal: 250ms ease;
      --transition-slow: 350ms ease;
      
      display: block;
    }

    /* ==================== App Wrapper ==================== */
    .app-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--bg-color);
    }

    /* ==================== Navbar ==================== */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height);
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
      transition: all var(--transition-normal);
    }

    .navbar.scrolled {
      box-shadow: var(--shadow-md);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      height: 100%;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* ==================== Brand ==================== */
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      transition: transform var(--transition-fast);
    }

    .brand:hover {
      transform: translateY(-1px);
    }

    .brand-logo {
      position: relative;
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }

    .brand-logo mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
      color: white;
    }

    .logo-pulse {
      position: absolute;
      inset: -3px;
      border-radius: var(--radius-md);
      border: 2px solid var(--primary-light);
      opacity: 0;
      animation: pulse-ring 2s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% {
        opacity: 0.6;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(1.15);
      }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.2;
    }

    .brand-tagline {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    /* ==================== Desktop Navigation ==================== */
    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.925rem;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item:hover {
      color: var(--primary-color);
      background: rgba(99, 102, 241, 0.08);
    }

    .nav-item.active {
      color: var(--primary-color);
      background: rgba(99, 102, 241, 0.1);
      font-weight: 600;
    }

    .nav-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: var(--primary-color);
      border-radius: 1px;
      transition: width var(--transition-normal);
    }

    .nav-item.active .nav-indicator {
      width: 24px;
    }

    .nav-badge {
      padding: 2px 8px;
      background: linear-gradient(135deg, var(--danger-color) 0%, #dc2626 100%);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      min-width: 18px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
    }

    .nav-cta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      margin-left: 8px;
      background: linear-gradient(135deg, var(--accent-color) 0%, #059669 100%);
      color: white;
      font-weight: 600;
      font-size: 0.925rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
      transition: all var(--transition-fast);
    }

    .nav-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.45);
    }

    .nav-cta mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* ==================== Right Section ==================== */
    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon-btn {
      position: relative;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .icon-btn:hover {
      background: var(--bg-elevated);
      border-color: var(--primary-light);
      color: var(--primary-color);
      transform: translateY(-1px);
    }

    .icon-btn mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: var(--danger-color);
      border: 2px solid var(--bg-elevated);
      border-radius: 50%;
    }

    /* ==================== Profile Trigger ==================== */
    .profile-trigger {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px 6px 6px;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .profile-trigger:hover {
      background: var(--bg-elevated);
      border-color: var(--primary-light);
      box-shadow: var(--shadow-sm);
    }

    .profile-avatar {
      position: relative;
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-text {
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border: 2px solid var(--bg-color);
      border-radius: 50%;
    }

    .status-indicator.online {
      background: var(--accent-color);
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .profile-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .profile-role {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .chevron {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      transition: transform var(--transition-normal);
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    /* ==================== Mobile Toggle ==================== */
    .mobile-toggle {
      display: none;
      width: 42px;
      height: 42px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .hamburger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 5px;
    }

    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      border-radius: 1px;
      transition: all var(--transition-normal);
    }

    .hamburger.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.active span:nth-child(2) {
      opacity: 0;
      transform: translateX(-10px);
    }

    .hamburger.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    /* ==================== Profile Dropdown (Desktop) ==================== */
    .profile-dropdown {
      position: absolute;
      top: calc(var(--navbar-height) - 4px);
      right: 24px;
      width: 320px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      z-index: 1001;
    }

    .dropdown-header {
      padding: 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.04) 100%);
      border-bottom: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .dropdown-avatar {
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }

    .dropdown-avatar span {
      color: white;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .dropdown-user-info h4 {
      margin: 0 0 4px 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .dropdown-user-info p {
      margin: 0 0 12px 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .role-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--primary-color);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .role-chip[data-role="admin"] {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
    }

    .role-chip[data-role="staff"] {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }

    .role-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-light);
    }

    .dropdown-menu {
      padding: 8px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .dropdown-item:hover {
      background: rgba(99, 102, 241, 0.06);
    }

    .item-icon {
      width: 42px;
      height: 42px;
      background: var(--bg-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .dropdown-item:hover .item-icon {
      background: var(--primary-color);
      color: white;
    }

    .item-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-title {
      font-size: 0.925rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .item-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .item-arrow {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      opacity: 0;
      transform: translateX(-4px);
      transition: all var(--transition-fast);
    }

    .dropdown-item:hover .item-arrow {
      opacity: 1;
      transform: translateX(0);
    }

    .dropdown-footer {
      padding: 12px 16px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px;
      background: rgba(239, 68, 68, 0.08);
      color: var(--danger-color);
      font-weight: 600;
      font-size: 0.925rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .logout-btn:hover {
      background: var(--danger-color);
      color: white;
    }

    /* ==================== Mobile Menu ==================== */
    .mobile-overlay,
    .profile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      z-index: 1100;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .mobile-menu {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-elevated);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      z-index: 1101;
      max-height: 70vh;
      overflow-y: auto;
    }

    .mobile-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-light);
    }

    .mobile-menu-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .close-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-color);
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      cursor: pointer;
    }

    .mobile-nav {
      padding: 16px;
    }

    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all var(--transition-fast);
    }

    .mobile-nav-item:hover {
      background: rgba(99, 102, 241, 0.06);
    }

    .mobile-nav-icon {
      width: 44px;
      height: 44px;
      background: var(--bg-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .mobile-nav-item span {
      flex: 1;
    }

    .nav-arrow {
      color: var(--text-muted);
    }

    .mobile-badge {
      padding: 4px 10px;
      background: var(--danger-color);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: var(--radius-full);
    }

    .mobile-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px;
      margin-top: 12px;
      background: linear-gradient(135deg, var(--accent-color) 0%, #059669 100%);
      color: white;
      font-weight: 600;
      font-size: 1rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
    }

    /* ==================== Profile Sheet (Mobile) ==================== */
    .profile-sheet {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--bg-elevated);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      z-index: 1101;
      max-height: 85vh;
      overflow-y: auto;
      padding-bottom: env(safe-area-inset-bottom, 20px);
    }

    .sheet-handle {
      width: 40px;
      height: 4px;
      background: var(--border-color);
      border-radius: 2px;
      margin: 12px auto 8px;
    }

    .sheet-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(79, 70, 229, 0.04) 100%);
      border-bottom: 1px solid var(--border-light);
    }

    .sheet-avatar {
      position: relative;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .sheet-avatar span {
      color: white;
      font-size: 2rem;
      font-weight: 700;
    }

    .avatar-ring {
      position: absolute;
      inset: -4px;
      border: 2px solid var(--primary-light);
      border-radius: 50%;
      opacity: 0.5;
    }

    .sheet-user-info {
      text-align: center;
      margin-bottom: 12px;
    }

    .sheet-user-info h3 {
      margin: 0 0 4px 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sheet-user-info p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .sheet-role {
      display: inline-block;
      padding: 6px 16px;
      background: var(--primary-color);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .sheet-role[data-role="admin"] {
      background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
    }

    .sheet-role[data-role="staff"] {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    }

    .sheet-stats {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: var(--bg-color);
      border-bottom: 1px solid var(--border-light);
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 32px;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 500;
      margin-top: 4px;
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--border-color);
    }

    .sheet-menu {
      padding: 16px;
    }

    .sheet-menu-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .sheet-menu-item:hover {
      background: rgba(99, 102, 241, 0.06);
    }

    .menu-item-icon {
      width: 48px;
      height: 48px;
      background: var(--bg-color);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color);
    }

    .menu-item-text {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .menu-item-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .menu-item-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .menu-item-arrow {
      color: var(--text-muted);
    }

    .sheet-footer {
      padding: 16px 24px 24px;
      border-top: 1px solid var(--border-light);
    }

    .sheet-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 16px;
      background: rgba(239, 68, 68, 0.08);
      color: var(--danger-color);
      font-weight: 600;
      font-size: 1rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .sheet-logout:hover {
      background: var(--danger-color);
      color: white;
    }

    /* ==================== Main Content ==================== */
    .main-content {
      flex: 1;
      margin-top: var(--navbar-height);
      padding: 32px 24px;
      max-width: 1400px;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    /* ==================== Footer ==================== */
    .footer {
      background: var(--bg-elevated);
      border-top: 1px solid var(--border-color);
      padding: 24px 0;
    }

    .footer-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-weight: 600;
    }

    .footer-brand mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .footer-copy {
      margin: 0;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--primary-color);
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 1024px) {
      .nav-desktop {
        display: none;
      }

      .mobile-toggle {
        display: flex;
      }

      .notification-btn {
        display: none;
      }
    }

    @media (max-width: 768px) {
      :host {
        --navbar-height: 64px;
      }

      .navbar-container {
        padding: 0 16px;
      }

      .brand-tagline {
        display: none;
      }

      .brand-name {
        font-size: 1.125rem;
      }

      .brand-logo {
        width: 40px;
        height: 40px;
      }

      .brand-logo mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .profile-info {
        display: none;
      }

      .chevron {
        display: none;
      }

      .profile-trigger {
        padding: 4px;
        border: none;
        background: transparent;
      }

      .main-content {
        padding: 20px 16px;
      }

      .footer-container {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .brand-text {
        display: none;
      }

      .stat-item {
        padding: 0 20px;
      }
    }

    /* ==================== Print ==================== */
    @media print {
      .navbar,
      .footer {
        display: none;
      }

      .main-content {
        margin-top: 0;
        padding: 0;
      }
    }
  `]
})
export class AppComponent {
  user$ = this.authService.user$;
  currentYear = new Date().getFullYear();
  assignedCount = 5;
  
  isScrolled = false;
  isProfileOpen = false;
  isMobileMenuOpen = false;
  isMobile = false;

  constructor(private authService: AuthService) {
    this.checkScreenSize();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-trigger') && !target.closest('.profile-dropdown') && !target.closest('.profile-sheet')) {
      this.isProfileOpen = false;
    }
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleProfile(): void {
    this.isProfileOpen = !this.isProfileOpen;
    this.isMobileMenuOpen = false;
    
    if (this.isProfileOpen && this.isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeProfile(): void {
    this.isProfileOpen = false;
    document.body.style.overflow = '';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isProfileOpen = false;
    
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  logout(): void {
    this.closeProfile();
    this.closeMobileMenu();
    this.authService.logout();
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'admin': 'shield',
      'staff': 'headset_mic',
      'user': 'person'
    };
    return icons[role] || 'person';
  }
}