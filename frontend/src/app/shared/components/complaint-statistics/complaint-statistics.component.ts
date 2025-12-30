import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Complaint } from '../../models';
import { AnalyticsService, Analytics } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-complaint-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="statistics-container">
      <div class="stats-grid">
        <!-- Total Complaints -->
        <mat-card class="stat-card total">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>description</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ analytics.totalComplaints }}</div>
              <div class="stat-label">Total Complaints</div>
            </div>
          </div>
        </mat-card>

        <!-- Resolved Complaints -->
        <mat-card class="stat-card resolved">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ analytics.resolvedComplaints }}</div>
              <div class="stat-label">Resolved</div>
            </div>
          </div>
        </mat-card>

        <!-- Pending Complaints -->
        <mat-card class="stat-card pending">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>schedule</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ analytics.pendingComplaints }}</div>
              <div class="stat-label">Pending</div>
            </div>
          </div>
        </mat-card>

        <!-- Resolution Rate -->
        <mat-card class="stat-card rate">
          <div class="stat-content">
            <div class="stat-icon">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ analytics.resolutionRate.toFixed(1) }}%</div>
              <div class="stat-label">Resolution Rate</div>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Detailed Statistics -->
      <mat-card class="details-card">
        <div class="card-header">
          <h3>Performance Metrics</h3>
        </div>
        
        <div class="metrics-section">
          <div class="metric">
            <div class="metric-label">Average Resolution Time</div>
            <div class="metric-value">{{ analytics.averageResolutionTime.toFixed(2) }} days</div>
          </div>

          <div class="metric">
            <div class="metric-label">Resolution Rate</div>
            <mat-progress-bar 
              mode="determinate" 
              [value]="analytics.resolutionRate"
              class="progress-bar">
            </mat-progress-bar>
            <div class="progress-text">{{ analytics.resolutionRate.toFixed(1) }}%</div>
          </div>
        </div>

        <!-- Status Distribution -->
        <div class="distribution-section">
          <h4>Status Distribution</h4>
          <div *ngFor="let item of getStatusItems()" class="distribution-item">
            <div class="distribution-label">{{ item.status }}</div>
            <div class="distribution-bar">
              <div 
                class="distribution-fill"
                [style.width]="(item.count / analytics.totalComplaints * 100) + '%'"
                [ngClass]="'status-' + item.status.toLowerCase()">
              </div>
            </div>
            <div class="distribution-count">{{ item.count }}</div>
          </div>
        </div>

        <!-- Priority Distribution -->
        <div class="distribution-section">
          <h4>Priority Distribution</h4>
          <div *ngFor="let item of getPriorityItems()" class="distribution-item">
            <div class="distribution-label">{{ item.priority }}</div>
            <div class="distribution-bar">
              <div 
                class="distribution-fill"
                [style.width]="(item.count / analytics.totalComplaints * 100) + '%'"
                [ngClass]="'priority-' + item.priority.toLowerCase()">
              </div>
            </div>
            <div class="distribution-count">{{ item.count }}</div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="distribution-section">
          <h4>Category Distribution</h4>
          <div *ngFor="let item of getCategoryItems()" class="distribution-item">
            <div class="distribution-label">{{ item.category }}</div>
            <div class="distribution-bar">
              <div 
                class="distribution-fill"
                [style.width]="(item.count / analytics.totalComplaints * 100) + '%'"
                style="background-color: #667eea;">
              </div>
            </div>
            <div class="distribution-count">{{ item.count }}</div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .statistics-container {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .stat-card {
      padding: 20px;
      display: flex;
      align-items: center;
      border-left: 4px solid #667eea;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
      }

      &.total {
        border-left-color: #667eea;
      }

      &.resolved {
        border-left-color: #10b981;
      }

      &.pending {
        border-left-color: #ef4444;
      }

      &.rate {
        border-left-color: #f59e0b;
      }
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
      color: #667eea;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .details-card {
      padding: 24px;
    }

    .card-header {
      margin-bottom: 24px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
      }
    }

    .metrics-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .metric-label {
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-size: 20px;
      font-weight: 600;
      color: #1f2937;
    }

    .progress-bar {
      height: 6px;
      border-radius: 3px;
      margin: 8px 0;
    }

    .progress-text {
      font-size: 12px;
      color: #6b7280;
      text-align: right;
    }

    .distribution-section {
      margin-bottom: 24px;

      h4 {
        font-size: 14px;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 16px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .distribution-item {
      display: grid;
      grid-template-columns: 80px 1fr 50px;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .distribution-label {
      font-size: 13px;
      color: #4b5563;
      font-weight: 500;
      text-transform: capitalize;
    }

    .distribution-bar {
      height: 20px;
      background-color: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
    }

    .distribution-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
      min-width: 2px;
    }

    .status-open {
      background-color: #fbbf24;
    }

    .status-assigned {
      background-color: #60a5fa;
    }

    .status-in-progress {
      background-color: #f97316;
    }

    .status-resolved {
      background-color: #10b981;
    }

    .priority-low {
      background-color: #10b981;
    }

    .priority-medium {
      background-color: #f59e0b;
    }

    .priority-high {
      background-color: #ef4444;
    }

    .distribution-count {
      font-size: 13px;
      font-weight: 600;
      color: #667eea;
      text-align: right;
    }

    @media (max-width: 768px) {
      .statistics-container {
        padding: 12px;
        gap: 12px;
      }

      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
      }

      .stat-card {
        padding: 12px;
      }

      .stat-content {
        gap: 8px;
      }

      .stat-icon {
        width: 40px;
        height: 40px;
      }

      .stat-value {
        font-size: 20px;
      }

      .details-card {
        padding: 16px;
      }
    }
  `]
})
export class ComplaintStatisticsComponent implements OnInit {
  @Input() complaints: Complaint[] = [];

  analytics: Analytics;

  constructor(private analyticsService: AnalyticsService) {
    this.analytics = {
      totalComplaints: 0,
      resolvedComplaints: 0,
      pendingComplaints: 0,
      resolutionRate: 0,
      averageResolutionTime: 0,
      statusDistribution: {},
      priorityDistribution: {},
      categoryDistribution: {},
      complaintsTrend: [],
      staffPerformance: []
    };
  }

  ngOnInit(): void {
    if (this.complaints && this.complaints.length > 0) {
      this.analytics = this.analyticsService.calculateAnalytics(this.complaints);
    }
  }

  ngOnChanges(): void {
    if (this.complaints && this.complaints.length > 0) {
      this.analytics = this.analyticsService.calculateAnalytics(this.complaints);
    }
  }

  getStatusItems() {
    return Object.entries(this.analytics.statusDistribution).map(([status, count]) => ({
      status,
      count
    })).sort((a, b) => b.count - a.count);
  }

  getPriorityItems() {
    return Object.entries(this.analytics.priorityDistribution).map(([priority, count]) => ({
      priority,
      count
    })).sort((a, b) => b.count - a.count);
  }

  getCategoryItems() {
    return Object.entries(this.analytics.categoryDistribution).map(([category, count]) => ({
      category,
      count
    })).sort((a, b) => b.count - a.count);
  }
}
