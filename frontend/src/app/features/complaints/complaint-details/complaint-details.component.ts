import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service';
import { AuthService } from '../../../core/services/auth.service';
import { Complaint } from '../../../shared/models';

@Component({
  selector: 'app-complaint-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('100ms', [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="details-container">
      <!-- Header Section -->
      <header class="details-header" @fadeInUp>
        <button mat-stroked-button class="back-btn" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to List
        </button>
        <div class="header-actions" *ngIf="!isLoading && complaint">
          <span class="complaint-id">#{{ complaint.id }}</span>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container" @scaleIn>
        <div class="loading-card">
          <div class="loader">
            <div class="loader-ring"></div>
            <mat-icon class="loader-icon">description</mat-icon>
          </div>
          <h3>Loading Complaint Details...</h3>
          <p>Please wait while we fetch the information</p>
        </div>
      </div>

      <!-- Complaint Details -->
      <div *ngIf="!isLoading && complaint" class="content-wrapper" @fadeInUp>
        
        <!-- Main Info Card -->
        <div class="info-card">
          <div class="card-header">
            <div class="header-left">
              <div class="category-badge" [attr.data-category]="complaint.category">
                <mat-icon>{{ getCategoryIcon(complaint.category) }}</mat-icon>
                {{ complaint.category }}
              </div>
              <h1 class="complaint-title">{{ complaint.title }}</h1>
            </div>
            <div class="status-badge" [attr.data-status]="complaint.status">
              <span class="status-dot"></span>
              {{ formatStatus(complaint.status) }}
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Details Grid -->
          <div class="details-grid" @staggerAnimation>
            <div class="detail-item">
              <div class="detail-icon">
                <mat-icon>schedule</mat-icon>
              </div>
              <div class="detail-content">
                <span class="detail-label">Created On</span>
                <span class="detail-value">{{ complaint.created_at | date:'MMM d, y' }}</span>
                <span class="detail-time">{{ complaint.created_at | date:'h:mm a' }}</span>
              </div>
            </div>

            <div class="detail-item" *ngIf="complaint.updated_at">
              <div class="detail-icon">
                <mat-icon>update</mat-icon>
              </div>
              <div class="detail-content">
                <span class="detail-label">Last Updated</span>
                <span class="detail-value">{{ complaint.updated_at | date:'MMM d, y' }}</span>
                <span class="detail-time">{{ complaint.updated_at | date:'h:mm a' }}</span>
              </div>
            </div>

            <div class="detail-item" *ngIf="complaint.staff_id">
              <div class="detail-icon">
                <mat-icon>person</mat-icon>
              </div>
              <div class="detail-content">
                <span class="detail-label">Assigned To</span>
                <span class="detail-value">Staff #{{ complaint.staff_id }}</span>
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-icon">
                <mat-icon>flag</mat-icon>
              </div>
              <div class="detail-content">
                <span class="detail-label">Priority</span>
                <div class="priority-indicator" [attr.data-priority]="complaint.priority || 'medium'">
                  <mat-icon>{{ getPriorityIcon(complaint.priority) }}</mat-icon>
                  {{ (complaint.priority || 'medium') | titlecase }}
                </div>
              </div>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Description Section -->
          <div class="description-section">
            <div class="section-header">
              <mat-icon>description</mat-icon>
              <h2>Complaint Description</h2>
            </div>
            <div class="description-content">
              <p>{{ complaint.description }}</p>
            </div>
          </div>
        </div>

        <!-- Status Update Card (Staff Only) -->
        <div *ngIf="isStaff" class="status-update-card" @scaleIn>
          <div class="card-header">
            <h2>
              <mat-icon>edit</mat-icon>
              Update Status
            </h2>
          </div>

          <div class="update-content">
            <p class="update-description">
              Change the complaint status to track its progress
            </p>

            <form [formGroup]="statusForm" (ngSubmit)="updateStatus()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select New Status</mat-label>
                <mat-icon matPrefix>flag</mat-icon>
                <mat-select formControlName="status">
                  <mat-option value="open">
                    <div class="status-option">
                      <span class="status-dot status-dot-open"></span>
                      Open
                    </div>
                  </mat-option>
                  <mat-option value="assigned">
                    <div class="status-option">
                      <span class="status-dot status-dot-assigned"></span>
                      Assigned
                    </div>
                  </mat-option>
                  <mat-option value="in-progress">
                    <div class="status-option">
                      <span class="status-dot status-dot-in-progress"></span>
                      In Progress
                    </div>
                  </mat-option>
                  <mat-option value="resolved">
                    <div class="status-option">
                      <span class="status-dot status-dot-resolved"></span>
                      Resolved
                    </div>
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <button 
                mat-flat-button 
                class="update-btn"
                type="submit" 
                [disabled]="isUpdating || statusForm.get('status')?.value === complaint.status">
                <span class="btn-content" *ngIf="!isUpdating">
                  <mat-icon>check_circle</mat-icon>
                  Update Status
                </span>
                <span class="btn-content" *ngIf="isUpdating">
                  <mat-progress-spinner
                    mode="indeterminate"
                    diameter="20"
                    class="spinner">
                  </mat-progress-spinner>
                  Updating...
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Timeline/Activity Card (Optional Enhancement) -->
        <div class="activity-card" @scaleIn>
          <div class="card-header">
            <h2>
              <mat-icon>timeline</mat-icon>
              Activity Timeline
            </h2>
          </div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Complaint Created</span>
                  <span class="timeline-time">{{ complaint.created_at | date:'short' }}</span>
                </div>
                <p class="timeline-description">Initial complaint submission</p>
              </div>
            </div>
            <div class="timeline-item" *ngIf="complaint.status !== 'open'">
              <div class="timeline-dot timeline-dot-active"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-title">Status: {{ formatStatus(complaint.status) }}</span>
                  <span class="timeline-time">{{ complaint.updated_at | date:'short' }}</span>
                </div>
                <p class="timeline-description">Current status of the complaint</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ==================== Variables ==================== */
    :host {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      
      --bg-primary: #f8fafc;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }

    /* ==================== Container ==================== */
    .details-container {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 24px;
    }

    /* ==================== Header ==================== */
    .details-header {
      max-width: 1000px;
      margin: 0 auto 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .back-btn {
      border-radius: var(--radius-md);
      padding: 8px 20px;
      font-weight: 500;
      border: 2px solid var(--border-color);
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      border-color: #667eea;
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .back-btn mat-icon {
      margin-right: 4px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .complaint-id {
      font-family: 'Monaco', 'Consolas', monospace;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      color: #667eea;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    /* ==================== Loading State ==================== */
    .loading-container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      padding: 60px 20px;
    }

    .loading-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 60px 80px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }

    .loader {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
    }

    .loader-ring {
      position: absolute;
      inset: 0;
      border: 4px solid var(--border-color);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .loader-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #667eea;
    }

    .loading-card h3 {
      margin: 0 0 8px;
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
    }

    .loading-card p {
      margin: 0;
      color: var(--text-secondary);
    }

    /* ==================== Content Wrapper ==================== */
    .content-wrapper {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* ==================== Info Card ==================== */
    .info-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .card-header {
      padding: 28px 32px;
      background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
      border-bottom: 1px solid var(--border-color);
    }

    .header-left {
      flex: 1;
    }

    .info-card .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
    }

    .complaint-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 12px 0 0 0;
      line-height: 1.3;
      letter-spacing: -0.5px;
    }

    /* Category Badge */
    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: var(--text-secondary);
      text-transform: capitalize;
    }

    .category-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      border-radius: 24px;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: capitalize;
      white-space: nowrap;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.1); }
    }

    .status-badge[data-status="open"] {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #92400e;
    }
    .status-badge[data-status="open"] .status-dot {
      background: #f59e0b;
    }

    .status-badge[data-status="assigned"] {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1e40af;
    }
    .status-badge[data-status="assigned"] .status-dot {
      background: #3b82f6;
    }

    .status-badge[data-status="in-progress"] {
      background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
      color: #9d174d;
    }
    .status-badge[data-status="in-progress"] .status-dot {
      background: #ec4899;
    }

    .status-badge[data-status="resolved"] {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #065f46;
    }
    .status-badge[data-status="resolved"] .status-dot {
      background: #10b981;
    }

    /* ==================== Details Grid ==================== */
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
      padding: 32px;
    }

    .detail-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .detail-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .detail-icon mat-icon {
      color: #667eea;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .detail-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .detail-time {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    /* Priority Indicator */
    .priority-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .priority-indicator mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .priority-indicator[data-priority="low"] {
      color: #10b981;
    }

    .priority-indicator[data-priority="medium"] {
      color: #f59e0b;
    }

    .priority-indicator[data-priority="high"] {
      color: #ef4444;
    }

    /* ==================== Description Section ==================== */
    .description-section {
      padding: 32px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .section-header mat-icon {
      color: #667eea;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .description-content {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: var(--radius-md);
      padding: 24px;
      border-left: 4px solid #667eea;
    }

    .description-content p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.8;
      white-space: pre-wrap;
      font-size: 0.95rem;
    }

    /* ==================== Status Update Card ==================== */
    .status-update-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .status-update-card .card-header h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .status-update-card .card-header h2 mat-icon {
      color: #667eea;
    }

    .update-content {
      padding: 28px 32px;
    }

    .update-description {
      color: var(--text-secondary);
      margin: 0 0 24px 0;
      font-size: 0.95rem;
    }

    .full-width {
      width: 100%;
    }

    ::ng-deep .full-width .mat-mdc-text-field-wrapper {
      background: var(--bg-card);
    }

    ::ng-deep .full-width .mat-mdc-form-field-icon-prefix {
      color: #667eea;
      margin-right: 12px;
      padding-left: 12px;
    }

    ::ng-deep .full-width.mat-focused .mat-mdc-notched-outline {
      border-color: #667eea !important;
      border-width: 2px !important;
    }

    .status-option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 4px 0;
    }

    .status-dot-open { background: #f59e0b; width: 10px; height: 10px; border-radius: 50%; }
    .status-dot-assigned { background: #3b82f6; width: 10px; height: 10px; border-radius: 50%; }
    .status-dot-in-progress { background: #ec4899; width: 10px; height: 10px; border-radius: 50%; }
    .status-dot-resolved { background: #10b981; width: 10px; height: 10px; border-radius: 50%; }

    .update-btn {
      width: 100%;
      background: var(--success-gradient);
      color: white;
      border-radius: var(--radius-md);
      padding: 12px 28px;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.3px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      height: 48px;
      margin-top: 12px;
    }

    .update-btn:not([disabled]):hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .update-btn[disabled] {
      background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
      color: white;
      box-shadow: none;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .spinner {
      display: inline-block;
    }

    ::ng-deep .spinner circle {
      stroke: white;
    }

    /* ==================== Activity/Timeline Card ==================== */
    .activity-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .activity-card .card-header h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .activity-card .card-header h2 mat-icon {
      color: #667eea;
    }

    .timeline {
      padding: 32px;
    }

    .timeline-item {
      display: flex;
      gap: 20px;
      padding-bottom: 24px;
      position: relative;
    }

    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 11px;
      top: 32px;
      bottom: 0;
      width: 2px;
      background: var(--border-color);
    }

    .timeline-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--bg-card);
      border: 3px solid var(--border-color);
      flex-shrink: 0;
      margin-top: 4px;
      z-index: 1;
    }

    .timeline-dot-active {
      border-color: #667eea;
      background: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .timeline-content {
      flex: 1;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .timeline-title {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .timeline-time {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .timeline-description {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.6;
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 768px) {
      .details-container {
        padding: 16px;
      }

      .details-header {
        margin-bottom: 20px;
      }

      .complaint-title {
        font-size: 1.35rem;
      }

      .info-card .card-header {
        flex-direction: column;
        align-items: flex-start;
        padding: 20px;
      }

      .card-header {
        padding: 20px;
      }

      .details-grid {
        grid-template-columns: 1fr;
        padding: 20px;
      }

      .description-section {
        padding: 20px;
      }

      .update-content {
        padding: 20px;
      }

      .timeline {
        padding: 20px;
      }

      .loading-card {
        padding: 40px 24px;
      }
    }

    @media (max-width: 480px) {
      .complaint-title {
        font-size: 1.15rem;
      }

      .details-grid {
        gap: 16px;
      }

      .detail-icon {
        width: 40px;
        height: 40px;
      }
    }
  `]
})
export class ComplaintDetailsComponent implements OnInit {
  complaint: Complaint | null = null;
  isLoading = true;
  isUpdating = false;
  isStaff = false;
  statusForm: FormGroup;

  constructor(
    private complaintService: ComplaintService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.statusForm = this.fb.group({
      status: ['']
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.isStaff = user?.role === 'staff' || user?.role === 'admin';

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadComplaint(id);
    });
  }

  loadComplaint(id: number): void {
    this.complaintService.getComplaintById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.complaint = response.data;
          this.statusForm.patchValue({ status: this.complaint.status });
        }
      },
      error: (error) => {
        this.snackBar.open('❌ Failed to load complaint', 'Close', { 
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateStatus(): void {
    const newStatus = this.statusForm.get('status')?.value;
    if (this.complaint && newStatus && newStatus !== this.complaint.status) {
      this.isUpdating = true;
      this.complaintService.updateComplaintStatus(this.complaint.id, newStatus).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.complaint = response.data;
            this.snackBar.open('✅ Status updated successfully!', 'Close', { 
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        },
        error: (error) => {
          this.snackBar.open('❌ Failed to update status', 'Close', { 
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        complete: () => {
          this.isUpdating = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/complaints']);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'plumbing': 'plumbing',
      'electrical': 'electrical_services',
      'facility': 'business',
      'maintenance': 'build',
      'sanitation': 'cleaning_services',
      'security': 'security',
      'other': 'more_horiz',
      'technical': 'computer',
      'billing': 'receipt',
      'service': 'support_agent',
      'product': 'inventory',
      'general': 'help_outline',
      'network': 'wifi',
      'default': 'folder'
    };
    return icons[category?.toLowerCase()] || icons['default'];
  }

  getPriorityIcon(priority: string): string {
    const icons: { [key: string]: string } = {
      'low': 'arrow_downward',
      'medium': 'remove',
      'high': 'arrow_upward'
    };
    return icons[priority?.toLowerCase()] || icons['medium'];
  }

  formatStatus(status: string): string {
    return status?.replace(/-/g, ' ') || status;
  }
}