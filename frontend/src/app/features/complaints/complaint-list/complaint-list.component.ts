import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint } from '../../../shared/models';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-complaint-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatRippleModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px) scale(0.95)' }),
          stagger('80ms', [
            animate('0.4s cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulse', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="complaints-container">
      <!-- Decorative Background Elements -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Header Section -->
      <header class="page-header" @fadeInUp>
        <div class="header-content">
          <div class="header-left">
            <div class="header-icon-wrapper">
              <mat-icon>folder_open</mat-icon>
            </div>
            <div class="header-text">
              <h1>My Complaints</h1>
              <p class="subtitle">
                <mat-icon>info</mat-icon>
                Track and manage your filed complaints
              </p>
            </div>
          </div>
          <div class="header-actions">
            <button mat-button class="refresh-btn" (click)="loadComplaints()" [disabled]="isLoading">
              <mat-icon [class.spin]="isLoading">sync</mat-icon>
              Refresh
            </button>
            <button mat-flat-button class="new-complaint-btn" routerLink="/complaints/new">
              <mat-icon>add_circle</mat-icon>
              File New Complaint
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Overview -->
      <section class="stats-overview" @fadeInUp>
        <div class="stat-card" *ngFor="let stat of stats; let i = index" [style.animation-delay]="i * 100 + 'ms'">
          <div class="stat-icon" [style.background]="stat.gradient">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-details">
            <span class="stat-number">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
          <div class="stat-trend" *ngIf="stat.trend">
            <mat-icon [class.up]="stat.trend > 0" [class.down]="stat.trend < 0">
              {{ stat.trend > 0 ? 'trending_up' : 'trending_down' }}
            </mat-icon>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state" @pulse>
        <div class="loading-card">
          <div class="loader-wrapper">
            <div class="loader-circle"></div>
            <div class="loader-circle delay-1"></div>
            <div class="loader-circle delay-2"></div>
            <mat-icon class="loader-icon">description</mat-icon>
          </div>
          <h3>Loading Complaints</h3>
          <p>Fetching your complaint history...</p>
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && complaints.length === 0" class="empty-state" @pulse>
        <div class="empty-card">
          <div class="empty-illustration">
            <div class="empty-folder">
              <mat-icon>folder_off</mat-icon>
            </div>
            <div class="empty-particles">
              <span *ngFor="let p of [1,2,3,4,5]"></span>
            </div>
          </div>
          <h2>No Complaints Yet</h2>
          <p>You haven't filed any complaints. Start by creating your first one!</p>
          <button mat-flat-button class="empty-cta" routerLink="/complaints/new">
            <mat-icon>add_circle_outline</mat-icon>
            File Your First Complaint
          </button>
          <div class="empty-features">
            <div class="feature">
              <mat-icon>bolt</mat-icon>
              <span>Quick Filing</span>
            </div>
            <div class="feature">
              <mat-icon>visibility</mat-icon>
              <span>Real-time Tracking</span>
            </div>
            <div class="feature">
              <mat-icon>notifications</mat-icon>
              <span>Instant Updates</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Complaints Grid -->
      <section *ngIf="!isLoading && complaints.length > 0" class="complaints-section" @fadeInUp>
        <div class="section-header">
          <h2>
            <mat-icon>list_alt</mat-icon>
            All Complaints
          </h2>
          <div class="view-toggle">
            <button mat-icon-button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'" matTooltip="Grid View">
              <mat-icon>grid_view</mat-icon>
            </button>
            <button mat-icon-button [class.active]="viewMode === 'list'" (click)="viewMode = 'list'" matTooltip="List View">
              <mat-icon>view_list</mat-icon>
            </button>
          </div>
        </div>

        <div class="complaints-grid" [class.list-view]="viewMode === 'list'" @staggerCards>
          <div *ngFor="let complaint of complaints; let i = index" 
               class="complaint-card" 
               [class.list-item]="viewMode === 'list'"
               (click)="navigateToComplaint(complaint.id)">
            
            <!-- Card Accent -->
            <div class="card-accent" [attr.data-status]="complaint.status"></div>
            
            <!-- Card Header -->
            <div class="card-header">
              <div class="complaint-info">
                <span class="complaint-id">#{{ complaint.id }}</span>
                <h3 class="complaint-title">{{ complaint.title }}</h3>
                <div class="complaint-category">
                  <mat-icon>{{ getCategoryIcon(complaint.category) }}</mat-icon>
                  <span>{{ complaint.category }}</span>
                </div>
              </div>
              <div class="status-container">
                <div class="status-badge" [attr.data-status]="complaint.status">
                  <span class="status-dot"></span>
                  <span class="status-text">{{ formatStatus(complaint.status) }}</span>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <p class="complaint-description">
                {{ complaint.description | slice:0:120 }}{{ complaint.description.length > 120 ? '...' : '' }}
              </p>
            </div>

            <!-- Card Footer -->
            <div class="card-footer">
              <div class="meta-info">
                <div class="meta-item" matTooltip="Created Date">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{ complaint.created_at | date:'MMM d, yyyy' }}</span>
                </div>
                <div class="meta-item" *ngIf="complaint.staff_id" matTooltip="Assigned to Staff">
                  <mat-icon>person_check</mat-icon>
                  <span>Assigned</span>
                </div>
                <div class="meta-item" *ngIf="!complaint.staff_id" matTooltip="Awaiting Assignment">
                  <mat-icon>hourglass_empty</mat-icon>
                  <span>Pending</span>
                </div>
              </div>
              <button mat-button class="view-btn" [routerLink]="['/complaints', complaint.id]" (click)="$event.stopPropagation()">
                <span>View Details</span>
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>

            <!-- Progress Indicator -->
            <div class="progress-bar" [attr.data-status]="complaint.status">
              <div class="progress-fill" [style.width]="getProgressWidth(complaint.status)"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Floating Action Button (Mobile) -->
      <button mat-fab class="fab-btn" routerLink="/complaints/new" matTooltip="File New Complaint">
        <mat-icon>add</mat-icon>
      </button>
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
      --info-light: #dbeafe;
      
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      --gradient-info: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      --gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      
      --bg-primary: #f0f4ff;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      
      --border-color: #e2e8f0;
      --border-radius-sm: 8px;
      --border-radius-md: 12px;
      --border-radius-lg: 16px;
      --border-radius-xl: 24px;
      
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.15);
    }

    /* ==================== Container ==================== */
    .complaints-container {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 32px;
      position: relative;
      overflow: hidden;
    }

    /* ==================== Background Decoration ==================== */
    .bg-decoration {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
    }

    .circle-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation: float 20s ease-in-out infinite;
    }

    .circle-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.1) 0%, transparent 70%);
      bottom: -100px;
      left: -100px;
      animation: float 15s ease-in-out infinite reverse;
    }

    .circle-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.08) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse-bg 10s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-30px) rotate(5deg); }
    }

    @keyframes pulse-bg {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
    }

    /* ==================== Page Header ==================== */
    .page-header {
      position: relative;
      z-index: 1;
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-icon-wrapper {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-lg), 0 0 30px rgba(102, 126, 234, 0.3);
    }

    .header-icon-wrapper mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }

    .header-text h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      letter-spacing: -0.5px;
    }

    .subtitle {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 8px 0 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .subtitle mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      opacity: 0.7;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-md);
      padding: 0 16px;
      height: 44px;
      background: white;
      transition: all 0.3s ease;
    }

    .refresh-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: rgba(102, 126, 234, 0.05);
    }

    .refresh-btn mat-icon.spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .new-complaint-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--gradient-primary);
      color: white;
      border-radius: var(--border-radius-md);
      padding: 0 24px;
      height: 48px;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: var(--shadow-md), 0 4px 15px rgba(102, 126, 234, 0.35);
      transition: all 0.3s ease;
    }

    .new-complaint-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg), 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    /* ==================== Stats Overview ==================== */
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
      position: relative;
      z-index: 1;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--border-radius-lg);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--gradient-primary);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .stat-card:hover::before {
      transform: scaleX(1);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .stat-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .stat-trend {
      opacity: 0.8;
    }

    .stat-trend mat-icon.up {
      color: var(--success);
    }

    .stat-trend mat-icon.down {
      color: var(--danger);
    }

    /* ==================== Loading State ==================== */
    .loading-state {
      display: flex;
      justify-content: center;
      padding: 80px 20px;
      position: relative;
      z-index: 1;
    }

    .loading-card {
      background: var(--bg-card);
      border-radius: var(--border-radius-xl);
      padding: 60px 80px;
      text-align: center;
      box-shadow: var(--shadow-xl), var(--shadow-glow);
      border: 1px solid var(--border-color);
    }

    .loader-wrapper {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 32px;
    }

    .loader-circle {
      position: absolute;
      inset: 0;
      border: 3px solid transparent;
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1.2s linear infinite;
    }

    .loader-circle.delay-1 {
      inset: 10px;
      border-top-color: var(--secondary);
      animation-delay: 0.2s;
      animation-direction: reverse;
    }

    .loader-circle.delay-2 {
      inset: 20px;
      border-top-color: var(--accent);
      animation-delay: 0.4s;
    }

    .loader-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: var(--primary);
    }

    .loading-card h3 {
      margin: 0 0 8px;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .loading-card p {
      margin: 0;
      color: var(--text-secondary);
    }

    .loading-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
    }

    .loading-dots span {
      width: 10px;
      height: 10px;
      background: var(--primary);
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .loading-dots span:nth-child(1) { animation-delay: 0s; }
    .loading-dots span:nth-child(2) { animation-delay: 0.16s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.32s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* ==================== Empty State ==================== */
    .empty-state {
      display: flex;
      justify-content: center;
      padding: 60px 20px;
      position: relative;
      z-index: 1;
    }

    .empty-card {
      background: var(--bg-card);
      border-radius: var(--border-radius-xl);
      padding: 60px 80px;
      text-align: center;
      box-shadow: var(--shadow-xl), var(--shadow-glow);
      border: 1px solid var(--border-color);
      max-width: 550px;
    }

    .empty-illustration {
      position: relative;
      margin-bottom: 32px;
    }

    .empty-folder {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      position: relative;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
    }

    .empty-folder mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: var(--text-muted);
    }

    .empty-particles {
      position: absolute;
      inset: -20px;
    }

    .empty-particles span {
      position: absolute;
      width: 8px;
      height: 8px;
      background: var(--primary-light);
      border-radius: 50%;
      animation: float-particle 3s ease-in-out infinite;
    }

    .empty-particles span:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
    .empty-particles span:nth-child(2) { top: 20%; right: 15%; animation-delay: 0.5s; }
    .empty-particles span:nth-child(3) { bottom: 25%; left: 10%; animation-delay: 1s; }
    .empty-particles span:nth-child(4) { bottom: 15%; right: 20%; animation-delay: 1.5s; }
    .empty-particles span:nth-child(5) { top: 50%; left: 5%; animation-delay: 2s; }

    @keyframes float-particle {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
      50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
    }

    .empty-card h2 {
      margin: 0 0 12px;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .empty-card > p {
      margin: 0 0 28px;
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.6;
    }

    .empty-cta {
      background: var(--gradient-primary);
      color: white;
      padding: 14px 32px;
      border-radius: var(--border-radius-md);
      font-weight: 600;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      box-shadow: var(--shadow-md), 0 4px 15px rgba(102, 126, 234, 0.35);
      transition: all 0.3s ease;
    }

    .empty-cta:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg), 0 8px 25px rgba(102, 126, 234, 0.45);
    }

    .empty-features {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px dashed var(--border-color);
    }

    .feature {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    .feature mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: var(--primary);
    }

    /* ==================== Complaints Section ==================== */
    .complaints-section {
      position: relative;
      z-index: 1;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .section-header h2 mat-icon {
      color: var(--primary);
    }

    .view-toggle {
      display: flex;
      gap: 4px;
      background: white;
      padding: 4px;
      border-radius: var(--border-radius-sm);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .view-toggle button {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }

    .view-toggle button.active {
      background: var(--gradient-primary);
      color: white;
    }

    /* ==================== Complaints Grid ==================== */
    .complaints-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .complaints-grid.list-view {
      grid-template-columns: 1fr;
    }

    .complaint-card {
      background: var(--bg-card);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .complaint-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl), 0 0 40px rgba(102, 126, 234, 0.1);
    }

    .complaint-card.list-item {
      flex-direction: row;
      align-items: center;
      padding: 20px;
    }

    .complaint-card.list-item .card-accent {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      height: 100%;
    }

    /* Card Accent */
    .card-accent {
      height: 4px;
      background: var(--gradient-primary);
    }

    .card-accent[data-status="open"] {
      background: var(--gradient-warning);
    }

    .card-accent[data-status="assigned"] {
      background: var(--gradient-info);
    }

    .card-accent[data-status="in-progress"] {
      background: var(--gradient-accent);
    }

    .card-accent[data-status="resolved"] {
      background: var(--gradient-success);
    }

    /* Card Header */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 20px 0;
      gap: 16px;
    }

    .list-item .card-header {
      padding: 0;
      flex: 0 0 auto;
      min-width: 280px;
    }

    .complaint-info {
      flex: 1;
      min-width: 0;
    }

    .complaint-id {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary);
      background: rgba(102, 126, 234, 0.1);
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 10px;
      font-family: 'Monaco', 'Consolas', monospace;
    }

    .complaint-title {
      margin: 0 0 8px;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .complaint-category {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
      background: var(--bg-primary);
      padding: 6px 12px;
      border-radius: 20px;
    }

    .complaint-category mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Status Badge */
    .status-container {
      flex-shrink: 0;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
    }

    .status-badge[data-status="open"] {
      background: var(--warning-light);
      color: #92400e;
    }
    .status-badge[data-status="open"] .status-dot { background: var(--warning); }

    .status-badge[data-status="assigned"] {
      background: var(--info-light);
      color: #1e40af;
    }
    .status-badge[data-status="assigned"] .status-dot { background: var(--info); }

    .status-badge[data-status="in-progress"] {
      background: #fce7f3;
      color: #9d174d;
    }
    .status-badge[data-status="in-progress"] .status-dot { background: #ec4899; }

    .status-badge[data-status="resolved"] {
      background: var(--success-light);
      color: #065f46;
    }
    .status-badge[data-status="resolved"] .status-dot { background: var(--success); }

    /* Card Body */
    .card-body {
      padding: 16px 20px;
      flex: 1;
    }

    .list-item .card-body {
      padding: 0 24px;
      flex: 1;
    }

    .complaint-description {
      margin: 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    /* Card Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-top: 1px solid var(--border-color);
      background: linear-gradient(to bottom, transparent, rgba(248, 250, 252, 0.5));
    }

    .list-item .card-footer {
      padding: 0;
      border: none;
      background: none;
      flex-shrink: 0;
    }

    .meta-info {
      display: flex;
      gap: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .view-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--primary);
      font-weight: 600;
      font-size: 0.875rem;
      padding: 8px 16px;
      border-radius: var(--border-radius-sm);
      transition: all 0.2s ease;
    }

    .view-btn:hover {
      background: rgba(102, 126, 234, 0.1);
    }

    .view-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      transition: transform 0.2s ease;
    }

    .view-btn:hover mat-icon {
      transform: translateX(4px);
    }

    /* Progress Bar */
    .progress-bar {
      height: 3px;
      background: var(--border-color);
      overflow: hidden;
    }

    .list-item .progress-bar {
      display: none;
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-primary);
      transition: width 0.5s ease;
    }

    .progress-bar[data-status="open"] .progress-fill { background: var(--gradient-warning); }
    .progress-bar[data-status="assigned"] .progress-fill { background: var(--gradient-info); }
    .progress-bar[data-status="in-progress"] .progress-fill { background: var(--gradient-accent); }
    .progress-bar[data-status="resolved"] .progress-fill { background: var(--gradient-success); }

    /* ==================== FAB Button ==================== */
    .fab-btn {
      position: fixed;
      bottom: 32px;
      right: 32px;
      background: var(--gradient-primary);
      color: white;
      box-shadow: var(--shadow-lg), 0 8px 25px rgba(102, 126, 234, 0.4);
      z-index: 100;
      display: none;
    }

    .fab-btn:hover {
      transform: scale(1.1);
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 1024px) {
      .complaints-grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .complaints-container {
        padding: 20px;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .header-left {
        flex-direction: column;
        align-items: flex-start;
        text-align: left;
      }

      .header-text h1 {
        font-size: 1.5rem;
      }

      .header-actions {
        flex-direction: column;
      }

      .refresh-btn, .new-complaint-btn {
        width: 100%;
        justify-content: center;
      }

      .new-complaint-btn {
        display: none;
      }

      .fab-btn {
        display: flex;
      }

      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .stat-card {
        padding: 16px;
        flex-direction: column;
        text-align: center;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .complaints-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .loading-card, .empty-card {
        padding: 40px 24px;
      }

      .empty-features {
        flex-direction: column;
        gap: 16px;
      }

      .complaint-card.list-item {
        flex-direction: column;
        align-items: stretch;
        padding: 0;
      }

      .list-item .card-header,
      .list-item .card-body,
      .list-item .card-footer {
        padding: 16px 20px;
      }

      .list-item .card-body {
        padding-top: 0;
      }

      .list-item .card-footer {
        border-top: 1px solid var(--border-color);
      }
    }

    @media (max-width: 480px) {
      .stats-overview {
        grid-template-columns: 1fr;
      }

      .stat-card {
        flex-direction: row;
        text-align: left;
      }

      .meta-info {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class ComplaintListComponent implements OnInit {
  complaints: Complaint[] = [];
  isLoading = false;
  viewMode: 'grid' | 'list' = 'grid';

  stats = [
    { icon: 'description', label: 'Total Complaints', value: 0, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', trend: 0 },
    { icon: 'hourglass_empty', label: 'Pending', value: 0, gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', trend: 0 },
    { icon: 'engineering', label: 'In Progress', value: 0, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', trend: 0 },
    { icon: 'check_circle', label: 'Resolved', value: 0, gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', trend: 0 }
  ];

  constructor(
    private complaintService: ComplaintService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;
    this.complaintService.getMyComplaints().subscribe({
      next: (response) => {
        try {
          if (response?.success && Array.isArray(response.data)) {
            this.complaints = response.data || [];
            this.updateStats();
          } else {
            console.warn('[ComplaintList] Invalid response structure:', response);
            this.complaints = [];
          }
        } catch (error) {
          console.error('[ComplaintList] Error processing complaints:', error);
          this.snackBar.open('❌ Error processing complaints data', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('[ComplaintList] Failed to load complaints:', error);
        const errorMsg = error?.error?.message || 'Failed to load complaints. Please try again.';
        this.snackBar.open(`❌ ${errorMsg}`, 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.complaints = [];
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateStats(): void {
    this.stats[0].value = this.complaints.length;
    this.stats[1].value = this.complaints.filter(c => c.status === 'open' || c.status === 'assigned').length;
    this.stats[2].value = this.complaints.filter(c => c.status === 'in-progress').length;
    this.stats[3].value = this.complaints.filter(c => c.status === 'resolved').length;
  }

  navigateToComplaint(id: number): void {
    this.router.navigate(['/complaints', id]);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'technical': 'computer',
      'billing': 'receipt_long',
      'service': 'support_agent',
      'product': 'inventory_2',
      'general': 'help_outline',
      'maintenance': 'build_circle',
      'security': 'security',
      'network': 'wifi',
      'hardware': 'devices',
      'software': 'apps',
      'default': 'category'
    };
    return icons[category?.toLowerCase()] || icons['default'];
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getProgressWidth(status: string): string {
    const progressMap: { [key: string]: string } = {
      'open': '25%',
      'assigned': '50%',
      'in-progress': '75%',
      'resolved': '100%'
    };
    return progressMap[status] || '0%';
  }
}