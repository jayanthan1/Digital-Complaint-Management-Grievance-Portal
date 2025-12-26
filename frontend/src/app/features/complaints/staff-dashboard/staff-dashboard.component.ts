import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../../core/services/complaint.service';
import { Complaint } from '../../../shared/models';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { StatusUpdateDialogComponent } from './status-update-dialog.component';

@Component({
  selector: 'app-staff-dashboard',
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
    MatRippleModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('50ms', [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header Section -->
      <header class="dashboard-header" @fadeInUp>
        <div class="header-content">
          <div class="header-text">
            <h1>
              <mat-icon class="header-icon">assignment_ind</mat-icon>
              My Assigned Complaints
            </h1>
            <p class="subtitle">Track and manage complaints assigned to you</p>
          </div>
          <button mat-flat-button class="refresh-btn" (click)="loadComplaints()" [disabled]="isLoading">
            <mat-icon [class.spin]="isLoading">refresh</mat-icon>
            Refresh
          </button>
        </div>
      </header>

      <!-- Stats Cards -->
      <section class="stats-section" @staggerAnimation>
        <div class="stat-card" *ngFor="let stat of stats">
          <div class="stat-icon" [style.background]="stat.gradient">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container" @scaleIn>
        <div class="loading-card">
          <div class="loader">
            <div class="loader-ring"></div>
            <mat-icon class="loader-icon">support_agent</mat-icon>
          </div>
          <h3>Loading Complaints...</h3>
          <p>Please wait while we fetch your assigned complaints</p>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && complaints.length === 0" class="empty-container" @scaleIn>
        <div class="empty-card">
          <div class="empty-illustration">
            <div class="empty-circle">
              <mat-icon>inbox</mat-icon>
            </div>
            <div class="empty-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <h3>No Complaints Assigned</h3>
          <p>You don't have any complaints assigned to you yet.</p>
          <p class="hint">New complaints will appear here when assigned by an admin.</p>
        </div>
      </div>

      <!-- Complaints Table -->
      <section *ngIf="!isLoading && complaints.length > 0" class="table-section" @fadeInUp>
        <div class="table-card">
          <div class="table-header">
            <h2>
              <mat-icon>list_alt</mat-icon>
              Complaint List
            </h2>
            <span class="complaint-count">{{ complaints.length }} Total</span>
          </div>

          <div class="table-wrapper">
            <table mat-table [dataSource]="complaints" class="complaints-table" @staggerAnimation>
              <!-- Title Column -->
              <ng-container matColumnDef="title">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>title</mat-icon>
                    Title
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="title-cell">
                    <span class="complaint-title">{{ element.title }}</span>
                    <span class="complaint-id">#{{ element.id }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Category Column -->
              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>category</mat-icon>
                    Category
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="category-badge" [attr.data-category]="element.category">
                    <mat-icon>{{ getCategoryIcon(element.category) }}</mat-icon>
                    {{ element.category }}
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>flag</mat-icon>
                    Status
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="status-badge" [attr.data-status]="element.status">
                    <span class="status-dot"></span>
                    {{ formatStatus(element.status) }}
                  </div>
                </td>
              </ng-container>

              <!-- Priority Column (Bonus) -->
              <ng-container matColumnDef="priority">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>priority_high</mat-icon>
                    Priority
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="priority-indicator" [attr.data-priority]="element.priority || 'medium'">
                    <mat-icon>{{ getPriorityIcon(element.priority) }}</mat-icon>
                    {{ (element.priority || 'medium') | titlecase }}
                  </div>
                </td>
              </ng-container>

              <!-- Created Date Column -->
              <ng-container matColumnDef="created_at">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>schedule</mat-icon>
                    Created
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="date-cell">
                    <span class="date">{{ element.created_at | date:'MMM d, y' }}</span>
                    <span class="time">{{ element.created_at | date:'h:mm a' }}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                  <div class="header-cell">
                    <mat-icon>settings</mat-icon>
                    Actions
                  </div>
                </th>
                <td mat-cell *matCellDef="let element">
                  <div class="actions-cell">
                    <button 
                      mat-icon-button 
                      class="action-btn view-btn"
                      [routerLink]="['/complaints', element.id]" 
                      matTooltip="View Details"
                      matTooltipPosition="above">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button 
                      mat-icon-button 
                      class="action-btn update-btn"
                      (click)="openStatusDialog(element)" 
                      matTooltip="Update Status"
                      matTooltipPosition="above">
                      <mat-icon>edit_note</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                  class="complaint-row"
                  [routerLink]="['/complaints', row.id]"></tr>
            </table>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* ==================== Variables ==================== */
    :host {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      --warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --dark-gradient: linear-gradient(135deg, #434343 0%, #000000 100%);
      
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
    .dashboard-container {
      min-height: 100vh;
      background: var(--bg-primary);
      padding: 24px;
    }

    /* ==================== Header ==================== */
    .dashboard-header {
      margin-bottom: 32px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      flex-wrap: wrap;
    }

    .header-text h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .header-icon {
      width: 40px;
      height: 40px;
      font-size: 40px;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }

    .refresh-btn {
      background: var(--primary-gradient);
      color: white;
      border-radius: var(--radius-md);
      padding: 8px 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-md);
    }

    .refresh-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .refresh-btn mat-icon.spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ==================== Stats Section ==================== */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-md);
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* ==================== Loading State ==================== */
    .loading-container {
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

    /* ==================== Empty State ==================== */
    .empty-container {
      display: flex;
      justify-content: center;
      padding: 60px 20px;
    }

    .empty-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 60px 80px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      max-width: 500px;
    }

    .empty-illustration {
      margin-bottom: 24px;
    }

    .empty-circle {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      position: relative;
    }

    .empty-circle mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
    }

    .empty-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
    }

    .empty-dots span {
      width: 8px;
      height: 8px;
      background: var(--border-color);
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .empty-dots span:nth-child(1) { animation-delay: 0s; }
    .empty-dots span:nth-child(2) { animation-delay: 0.2s; }
    .empty-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .empty-card h3 {
      margin: 0 0 8px;
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 600;
    }

    .empty-card p {
      margin: 0 0 4px;
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .empty-card .hint {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    /* ==================== Table Section ==================== */
    .table-section {
      animation: fadeIn 0.4s ease-out;
    }

    .table-card {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      border-bottom: 1px solid var(--border-color);
      background: linear-gradient(135deg, #fafbff 0%, #f8fafc 100%);
    }

    .table-header h2 {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .table-header h2 mat-icon {
      color: #667eea;
    }

    .complaint-count {
      background: var(--primary-gradient);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .complaints-table {
      width: 100%;
      border-collapse: collapse;
    }

    /* Header Cells */
    .complaints-table th {
      background: #f8fafc !important;
      padding: 16px 20px !important;
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--border-color);
    }

    .header-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-cell mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.7;
    }

    /* Body Cells */
    .complaints-table td {
      padding: 20px !important;
      border-bottom: 1px solid var(--border-color);
      vertical-align: middle;
    }

    /* Row Hover */
    .complaint-row {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .complaint-row:hover {
      background: linear-gradient(135deg, #f8faff 0%, #f0f7ff 100%) !important;
    }

    .complaint-row:hover td {
      border-bottom-color: transparent;
    }

    /* Title Cell */
    .title-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .complaint-title {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .complaint-id {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-family: 'Monaco', 'Consolas', monospace;
    }

    /* Category Badge */
    .category-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      background: #f1f5f9;
      color: var(--text-secondary);
      text-transform: capitalize;
    }

    .category-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Status Badge */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-dot {
      width: 8px;
      height: 8px;
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

    /* Priority Indicator */
    .priority-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 500;
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

    /* Date Cell */
    .date-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .date-cell .date {
      font-weight: 500;
      color: var(--text-primary);
      font-size: 0.9rem;
    }

    .date-cell .time {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Actions Cell */
    .actions-cell {
      display: flex;
      gap: 4px;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }

    .action-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .view-btn {
      color: #667eea;
    }

    .view-btn:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: scale(1.1);
    }

    .update-btn {
      color: #10b981;
    }

    .update-btn:hover {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      color: white;
      transform: scale(1.1);
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
      }

      .header-text h1 {
        font-size: 1.5rem;
      }

      .refresh-btn {
        width: 100%;
        justify-content: center;
      }

      .stats-section {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .stat-card {
        padding: 16px;
        flex-direction: column;
        text-align: center;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
      }

      .stat-value {
        font-size: 1.5rem;
      }

      .table-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
      }

      .loading-card,
      .empty-card {
        padding: 40px 24px;
      }

      .complaints-table th,
      .complaints-table td {
        padding: 12px !important;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class StaffDashboardComponent implements OnInit {
  complaints: Complaint[] = [];
  unassignedComplaints: Complaint[] = [];
  isLoading = false;
  displayedColumns: string[] = ['title', 'category', 'status', 'created_at', 'actions'];
  activeTab: 'assigned' | 'available' = 'assigned';

  stats = [
    { icon: 'assignment', label: 'Total Assigned', value: 0, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { icon: 'hourglass_empty', label: 'In Progress', value: 0, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { icon: 'check_circle', label: 'Resolved', value: 0, gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { icon: 'schedule', label: 'Pending', value: 0, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
  ];

  constructor(
    private complaintService: ComplaintService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.isLoading = true;
    
    // Load both assigned and unassigned complaints in parallel
    Promise.all([
      this.complaintService.getStaffAssignedComplaints().toPromise(),
      this.complaintService.getUnassignedComplaints().toPromise()
    ]).then(([assignedResponse, unassignedResponse]) => {
      let assignedComplaints: Complaint[] = [];
      let unassignedComplaints: Complaint[] = [];
      
      if (assignedResponse?.success && assignedResponse.data) {
        assignedComplaints = assignedResponse.data;
      }
      if (unassignedResponse?.success && unassignedResponse.data) {
        unassignedComplaints = unassignedResponse.data;
      }
      
      // Merge both assigned and unassigned complaints
      this.complaints = [...assignedComplaints, ...unassignedComplaints];
      this.unassignedComplaints = unassignedComplaints;
      this.updateStats();
      this.isLoading = false;
    }).catch(error => {
      this.snackBar.open('Failed to load complaints', 'Close', { 
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      this.isLoading = false;
    });
  }

  updateStats(): void {
    this.stats[0].value = this.complaints.length; // Total (assigned + unassigned)
    this.stats[1].value = this.complaints.filter(c => c.status === 'in-progress').length;
    this.stats[2].value = this.complaints.filter(c => c.status === 'resolved').length;
    this.stats[3].value = this.complaints.filter(c => c.status === 'assigned' || c.status === 'open').length;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'technical': 'computer',
      'billing': 'receipt',
      'service': 'support_agent',
      'product': 'inventory',
      'general': 'help_outline',
      'maintenance': 'build',
      'security': 'security',
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

  claimComplaint(complaintId: number): void {
    this.isLoading = true;
    // Get the current user ID from localStorage (you may need to adjust based on your auth service)
    const userId = this.getUserIdFromToken();
    
    this.complaintService.assignToStaff(complaintId, userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('✅ Complaint claimed successfully!', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.loadComplaints();
        }
      },
      error: (error) => {
        this.snackBar.open('❌ Failed to claim complaint', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }

  private getUserIdFromToken(): number {
    // Decode JWT token to get user ID
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (e) {
        console.error('Failed to decode token');
        return 0;
      }
    }
    return 0;
  }

  switchTab(tab: 'assigned' | 'available'): void {
    this.activeTab = tab;
  }

  openStatusDialog(complaint: Complaint): void {
    const dialogRef = this.dialog.open(StatusUpdateDialogComponent, {
      width: '400px',
      data: { complaint, statusOptions: ['assigned', 'in-progress', 'resolved'] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status) {
        this.updateComplaintStatus(complaint.id, result.status);
      }
    });
  }

  updateComplaintStatus(complaintId: number, status: string): void {
    this.isLoading = true;
    this.complaintService.updateComplaintStatus(complaintId, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(`✅ Status updated to ${status}!`, 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar']
          });
          this.loadComplaints();
        }
      },
      error: (error) => {
        this.snackBar.open('❌ Failed to update complaint status', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
  }
}