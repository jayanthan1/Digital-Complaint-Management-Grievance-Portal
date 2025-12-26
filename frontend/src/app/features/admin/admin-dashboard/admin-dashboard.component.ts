import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ComplaintService } from '../../../core/services/complaint.service';
import { UserService } from '../../../core/services/user.service';
import { Complaint, User } from '../../../shared/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="admin-dashboard">
      <!-- Header -->
      <header class="header">
        <div class="header-container">
          <div class="header-left">
            <div class="header-icon-wrapper">
              <mat-icon>admin_panel_settings</mat-icon>
            </div>
            <div class="header-text">
              <h1>Admin Dashboard</h1>
              <p>Manage complaints, users, and view analytics</p>
            </div>
          </div>
          <div class="header-right">
            <div class="header-stat">
              <span class="header-stat-value">{{ allComplaints.length }}</span>
              <span class="header-stat-label">Complaints</span>
            </div>
            <div class="header-stat">
              <span class="header-stat-value">{{ allUsers.length }}</span>
              <span class="header-stat-label">Users</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <mat-tab-group class="dashboard-tabs" animationDuration="200ms">
          
          <!-- Analytics Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                <mat-icon>analytics</mat-icon>
                <span class="tab-text">Analytics</span>
              </div>
            </ng-template>
            
            <div class="tab-content">
              <!-- Loading -->
              <div *ngIf="isLoadingStats" class="loading-state">
                <mat-spinner diameter="45"></mat-spinner>
                <p>Loading analytics...</p>
              </div>

              <!-- Analytics Content -->
              <div *ngIf="!isLoadingStats" class="analytics-content">
                
                <!-- Stats Cards -->
                <div class="section-title">
                  <mat-icon>bar_chart</mat-icon>
                  <h2>Complaint Overview</h2>
                </div>

                <div class="stats-grid">
                  <div class="stat-card">
                    <div class="stat-card-icon total">
                      <mat-icon>assignment</mat-icon>
                    </div>
                    <div class="stat-card-content">
                      <span class="stat-number">{{ totalComplaints }}</span>
                      <span class="stat-text">Total Complaints</span>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-card-icon open">
                      <mat-icon>error_outline</mat-icon>
                    </div>
                    <div class="stat-card-content">
                      <span class="stat-number">{{ openCount }}</span>
                      <span class="stat-text">Open</span>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-card-icon assigned">
                      <mat-icon>person_add</mat-icon>
                    </div>
                    <div class="stat-card-content">
                      <span class="stat-number">{{ assignedCount }}</span>
                      <span class="stat-text">Assigned</span>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-card-icon progress">
                      <mat-icon>autorenew</mat-icon>
                    </div>
                    <div class="stat-card-content">
                      <span class="stat-number">{{ inProgressCount }}</span>
                      <span class="stat-text">In Progress</span>
                    </div>
                  </div>

                  <div class="stat-card">
                    <div class="stat-card-icon resolved">
                      <mat-icon>check_circle</mat-icon>
                    </div>
                    <div class="stat-card-content">
                      <span class="stat-number">{{ resolvedCount }}</span>
                      <span class="stat-text">Resolved</span>
                    </div>
                  </div>
                </div>

                <!-- Resolution Rate -->
                <div class="resolution-card">
                  <div class="resolution-header">
                    <mat-icon>speed</mat-icon>
                    <h3>Resolution Rate</h3>
                  </div>
                  <div class="resolution-body">
                    <div class="resolution-percentage">{{ resolutionRate }}%</div>
                    <div class="resolution-bar">
                      <div class="resolution-bar-fill" [style.width.%]="resolutionRate"></div>
                    </div>
                    <p class="resolution-text">{{ resolvedCount }} of {{ totalComplaints }} complaints resolved</p>
                  </div>
                </div>

                <!-- Category Breakdown -->
                <div class="section-title">
                  <mat-icon>category</mat-icon>
                  <h2>Complaints by Category</h2>
                </div>

                <div class="category-grid" *ngIf="categoryStats.length > 0">
                  <div *ngFor="let cat of categoryStats" class="category-card">
                    <div class="category-info">
                      <mat-icon>folder</mat-icon>
                      <span class="category-name">{{ cat.category }}</span>
                    </div>
                    <div class="category-stats">
                      <span class="category-count">{{ cat.count }}</span>
                      <div class="category-bar">
                        <div class="category-bar-fill" [style.width.%]="getCategoryPercentage(cat.count)"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="categoryStats.length === 0" class="no-data">
                  <mat-icon>info</mat-icon>
                  <p>No category data available</p>
                </div>

                <!-- User Summary -->
                <div class="section-title">
                  <mat-icon>people</mat-icon>
                  <h2>User Summary</h2>
                </div>

                <div class="user-summary-grid">
                  <div class="user-summary-card admin">
                    <mat-icon>shield</mat-icon>
                    <div class="user-summary-info">
                      <span class="user-summary-count">{{ getUserCountByRole('admin') }}</span>
                      <span class="user-summary-label">Administrators</span>
                    </div>
                  </div>
                  <div class="user-summary-card staff">
                    <mat-icon>support_agent</mat-icon>
                    <div class="user-summary-info">
                      <span class="user-summary-count">{{ getUserCountByRole('staff') }}</span>
                      <span class="user-summary-label">Staff Members</span>
                    </div>
                  </div>
                  <div class="user-summary-card user">
                    <mat-icon>person</mat-icon>
                    <div class="user-summary-info">
                      <span class="user-summary-count">{{ getUserCountByRole('user') }}</span>
                      <span class="user-summary-label">Regular Users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- All Complaints Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                <mat-icon>list_alt</mat-icon>
                <span class="tab-text">Complaints</span>
                <span class="tab-badge" *ngIf="openCount > 0">{{ openCount }}</span>
              </div>
            </ng-template>
            
            <div class="tab-content">
              <!-- Loading -->
              <div *ngIf="isLoadingComplaints" class="loading-state">
                <mat-spinner diameter="45"></mat-spinner>
                <p>Loading complaints...</p>
              </div>

              <!-- Complaints Content -->
              <div *ngIf="!isLoadingComplaints">
                <div class="section-header">
                  <div class="section-title">
                    <mat-icon>list_alt</mat-icon>
                    <h2>All Complaints</h2>
                    <span class="count-badge">{{ allComplaints.length }}</span>
                  </div>
                  <button mat-raised-button color="primary" class="refresh-btn" (click)="loadAllComplaints()">
                    <mat-icon>refresh</mat-icon>
                    <span class="btn-text">Refresh</span>
                  </button>
                </div>

                <!-- Mobile Card View for Complaints -->
                <div class="mobile-cards" *ngIf="allComplaints.length > 0">
                  <div *ngFor="let complaint of allComplaints" class="mobile-card">
                    <div class="mobile-card-header">
                      <span class="id-badge">#{{ complaint.id }}</span>
                      <span class="status-badge" [ngClass]="'status-' + complaint.status">
                        <span class="status-dot"></span>
                        {{ formatStatus(complaint.status) }}
                      </span>
                    </div>
                    <div class="mobile-card-body">
                      <h4>{{ complaint.title }}</h4>
                      <p class="complaint-desc">{{ complaint.description | slice:0:80 }}...</p>
                      <div class="mobile-card-meta">
                        <span class="category-chip">{{ complaint.category }}</span>
                        <span class="date-text">
                          <mat-icon>calendar_today</mat-icon>
                          {{ complaint.created_at | date:'shortDate' }}
                        </span>
                      </div>
                    </div>
                    <div class="mobile-card-footer">
                      <label>Assign To:</label>
                      <mat-form-field appearance="outline" class="assign-select-mobile">
                        <mat-select [(value)]="complaint.staff_id" 
                                    (selectionChange)="assignComplaint(complaint.id, $event.value)">
                          <mat-option *ngFor="let staff of staffMembers" [value]="staff.id">
                            {{ staff.name }}
                          </mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>
                  </div>
                </div>

                <!-- Desktop Table View for Complaints -->
                <div *ngIf="allComplaints.length > 0" class="table-wrapper">
                  <table mat-table [dataSource]="allComplaints" class="modern-table">
                    
                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef>ID</th>
                      <td mat-cell *matCellDef="let row">
                        <span class="id-badge">#{{ row.id }}</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="title">
                      <th mat-header-cell *matHeaderCellDef>Title</th>
                      <td mat-cell *matCellDef="let row">
                        <div class="title-cell">
                          <span class="complaint-title">{{ row.title }}</span>
                          <span class="complaint-desc">{{ row.description | slice:0:50 }}...</span>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="category">
                      <th mat-header-cell *matHeaderCellDef>Category</th>
                      <td mat-cell *matCellDef="let row">
                        <span class="category-chip">{{ row.category }}</span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="status">
                      <th mat-header-cell *matHeaderCellDef>Status</th>
                      <td mat-cell *matCellDef="let row">
                        <span class="status-badge" [ngClass]="'status-' + row.status">
                          <span class="status-dot"></span>
                          {{ formatStatus(row.status) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="created">
                      <th mat-header-cell *matHeaderCellDef>Created</th>
                      <td mat-cell *matCellDef="let row">
                        <div class="date-cell">
                          <mat-icon>calendar_today</mat-icon>
                          {{ row.created_at | date:'mediumDate' }}
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="assign">
                      <th mat-header-cell *matHeaderCellDef>Assigned To</th>
                      <td mat-cell *matCellDef="let row">
                        <mat-form-field appearance="outline" class="assign-select">
                          <mat-select [(value)]="row.staff_id" 
                                      (selectionChange)="assignComplaint(row.id, $event.value)">
                            <mat-option *ngFor="let staff of staffMembers" [value]="staff.id">
                              <div class="staff-option">
                                <div class="staff-avatar">{{ staff.name.charAt(0) }}</div>
                                {{ staff.name }}
                              </div>
                            </mat-option>
                          </mat-select>
                        </mat-form-field>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="complaintColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: complaintColumns;" class="table-row"></tr>
                  </table>
                </div>

                <!-- Empty State -->
                <div *ngIf="allComplaints.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <mat-icon>inbox</mat-icon>
                  </div>
                  <h3>No Complaints</h3>
                  <p>There are no complaints in the system yet.</p>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Manage Users Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <div class="tab-label">
                <mat-icon>people</mat-icon>
                <span class="tab-text">Users</span>
              </div>
            </ng-template>
            
            <div class="tab-content">
              <!-- Loading -->
              <div *ngIf="isLoadingUsers" class="loading-state">
                <mat-spinner diameter="45"></mat-spinner>
                <p>Loading users...</p>
              </div>

              <!-- Users Content -->
              <div *ngIf="!isLoadingUsers">
                <div class="section-header">
                  <div class="section-title">
                    <mat-icon>people</mat-icon>
                    <h2>All Users</h2>
                    <span class="count-badge">{{ allUsers.length }}</span>
                  </div>
                  <button mat-raised-button color="primary" class="refresh-btn" (click)="loadAllUsers()">
                    <mat-icon>refresh</mat-icon>
                    <span class="btn-text">Refresh</span>
                  </button>
                </div>

                <!-- Role Filter Chips -->
                <div class="role-chips">
                  <div class="role-chip all" [class.active]="selectedRole === 'all'" (click)="filterByRole('all')">
                    <mat-icon>group</mat-icon>
                    <span class="chip-text">All</span>
                    <span class="chip-count">({{ allUsers.length }})</span>
                  </div>
                  <div class="role-chip admin" [class.active]="selectedRole === 'admin'" (click)="filterByRole('admin')">
                    <mat-icon>shield</mat-icon>
                    <span class="chip-text">Admins</span>
                    <span class="chip-count">({{ getUserCountByRole('admin') }})</span>
                  </div>
                  <div class="role-chip staff" [class.active]="selectedRole === 'staff'" (click)="filterByRole('staff')">
                    <mat-icon>support_agent</mat-icon>
                    <span class="chip-text">Staff</span>
                    <span class="chip-count">({{ getUserCountByRole('staff') }})</span>
                  </div>
                  <div class="role-chip user" [class.active]="selectedRole === 'user'" (click)="filterByRole('user')">
                    <mat-icon>person</mat-icon>
                    <span class="chip-text">Users</span>
                    <span class="chip-count">({{ getUserCountByRole('user') }})</span>
                  </div>
                </div>

                <!-- Mobile Card View for Users -->
                <div class="mobile-cards" *ngIf="filteredUsers.length > 0">
                  <div *ngFor="let user of filteredUsers" class="mobile-card user-card">
                    <div class="user-card-header">
                      <div class="user-avatar-large" [ngClass]="'avatar-' + user.role">
                        {{ user.name.charAt(0).toUpperCase() }}
                      </div>
                      <div class="user-card-info">
                        <h4>{{ user.name }}</h4>
                        <span class="role-badge" [ngClass]="'role-' + user.role">
                          <mat-icon>{{ getRoleIcon(user.role) }}</mat-icon>
                          {{ user.role | titlecase }}
                        </span>
                      </div>
                    </div>
                    <div class="user-card-body">
                      <div class="user-detail">
                        <mat-icon>mail</mat-icon>
                        <span>{{ user.email }}</span>
                      </div>
                      <div class="user-detail" *ngIf="user.contact_info">
                        <mat-icon>phone</mat-icon>
                        <span>{{ user.contact_info }}</span>
                      </div>
                      <div class="user-detail" *ngIf="!user.contact_info">
                        <mat-icon>phone</mat-icon>
                        <span class="no-data-text">Not provided</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Desktop Table View for Users -->
                <div *ngIf="filteredUsers.length > 0" class="table-wrapper">
                  <table mat-table [dataSource]="filteredUsers" class="modern-table">
                    
                    <ng-container matColumnDef="id">
                      <th mat-header-cell *matHeaderCellDef>ID</th>
                      <td mat-cell *matCellDef="let row">{{ row.id }}</td>
                    </ng-container>

                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Name</th>
                      <td mat-cell *matCellDef="let row">
                        <div class="user-cell">
                          <div class="user-avatar" [ngClass]="'avatar-' + row.role">
                            {{ row.name.charAt(0).toUpperCase() }}
                          </div>
                          <span class="user-name">{{ row.name }}</span>
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="email">
                      <th mat-header-cell *matHeaderCellDef>Email</th>
                      <td mat-cell *matCellDef="let row">
                        <div class="email-cell">
                          <mat-icon>mail</mat-icon>
                          {{ row.email }}
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="role">
                      <th mat-header-cell *matHeaderCellDef>Role</th>
                      <td mat-cell *matCellDef="let row">
                        <span class="role-badge" [ngClass]="'role-' + row.role">
                          <mat-icon>{{ getRoleIcon(row.role) }}</mat-icon>
                          {{ row.role | titlecase }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="contact">
                      <th mat-header-cell *matHeaderCellDef>Contact</th>
                      <td mat-cell *matCellDef="let row">
                        <div class="contact-cell" *ngIf="row.contact_info">
                          <mat-icon>phone</mat-icon>
                          {{ row.contact_info }}
                        </div>
                        <span class="no-data-text" *ngIf="!row.contact_info">Not provided</span>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="userColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: userColumns;" class="table-row"></tr>
                  </table>
                </div>

                <!-- Empty State -->
                <div *ngIf="filteredUsers.length === 0" class="empty-state">
                  <div class="empty-icon">
                    <mat-icon>person_off</mat-icon>
                  </div>
                  <h3>No Users Found</h3>
                  <p>No users match the selected filter.</p>
                </div>
              </div>
            </div>
          </mat-tab>

        </mat-tab-group>
      </main>
    </div>
  `,
  styles: [`
    /* ========== Base Styles ========== */
    * {
      box-sizing: border-box;
    }

    .admin-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    }

    /* ========== Header ========== */
    .header {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      color: white;
      padding: 24px 32px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon-wrapper {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);
      flex-shrink: 0;
    }

    .header-icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-text h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-text p {
      margin: 4px 0 0 0;
      opacity: 0.85;
      font-size: 0.875rem;
    }

    .header-right {
      display: flex;
      gap: 16px;
    }

    .header-stat {
      text-align: center;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }

    .header-stat-value {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .header-stat-label {
      font-size: 0.75rem;
      opacity: 0.85;
    }

    /* ========== Main Content ========== */
    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    /* ========== Tabs ========== */
    .dashboard-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    ::ng-deep .dashboard-tabs .mat-mdc-tab-header {
      background: #fafbfc;
      border-bottom: 1px solid #e8ecef;
    }

    ::ng-deep .dashboard-tabs .mat-mdc-tab {
      height: 56px;
      min-width: 100px;
    }

    .tab-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .tab-label mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .tab-badge {
      background: #ef5350;
      color: white;
      font-size: 0.65rem;
      padding: 2px 6px;
      border-radius: 8px;
      font-weight: 600;
      min-width: 18px;
      text-align: center;
    }

    .tab-content {
      padding: 24px;
      min-height: 400px;
    }

    /* ========== Section Styles ========== */
    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }

    .section-title mat-icon {
      color: #1e3c72;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .section-title h2 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 12px;
      flex-wrap: wrap;
    }

    .count-badge {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ========== Loading State ========== */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-state p {
      margin-top: 16px;
      font-size: 0.95rem;
    }

    /* ========== Stats Grid ========== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border: 1px solid #f0f0f0;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .stat-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: white;
    }

    .stat-card-icon.total { background: linear-gradient(135deg, #667eea, #764ba2); }
    .stat-card-icon.open { background: linear-gradient(135deg, #ff6b6b, #ee5a24); }
    .stat-card-icon.assigned { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .stat-card-icon.progress { background: linear-gradient(135deg, #fa709a, #fee140); }
    .stat-card-icon.resolved { background: linear-gradient(135deg, #11998e, #38ef7d); }

    .stat-card-content {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: #333;
      line-height: 1;
    }

    .stat-text {
      font-size: 0.8rem;
      color: #666;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ========== Resolution Card ========== */
    .resolution-card {
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      color: white;
    }

    .resolution-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .resolution-header mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .resolution-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .resolution-body {
      text-align: center;
    }

    .resolution-percentage {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 12px;
    }

    .resolution-bar {
      height: 10px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .resolution-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #38ef7d, #11998e);
      border-radius: 5px;
      transition: width 1s ease;
    }

    .resolution-text {
      margin: 0;
      opacity: 0.85;
      font-size: 0.875rem;
    }

    /* ========== Category Grid ========== */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }

    .category-card {
      background: white;
      border-radius: 10px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid #f0f0f0;
      transition: all 0.2s ease;
    }

    .category-card:hover {
      border-color: #1e3c72;
      box-shadow: 0 4px 16px rgba(30, 60, 114, 0.1);
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .category-info mat-icon {
      color: #1e3c72;
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .category-name {
      font-weight: 500;
      color: #333;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .category-stats {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .category-count {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e3c72;
    }

    .category-bar {
      width: 60px;
      height: 6px;
      background: #e8ecef;
      border-radius: 3px;
      overflow: hidden;
    }

    .category-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #1e3c72, #2a5298);
      border-radius: 3px;
    }

    /* ========== User Summary Grid ========== */
    .user-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .user-summary-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      border-left: 4px solid;
      transition: all 0.3s ease;
    }

    .user-summary-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .user-summary-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
    }

    .user-summary-card.admin { border-color: #e91e63; }
    .user-summary-card.admin mat-icon { color: #e91e63; }

    .user-summary-card.staff { border-color: #2196f3; }
    .user-summary-card.staff mat-icon { color: #2196f3; }

    .user-summary-card.user { border-color: #4caf50; }
    .user-summary-card.user mat-icon { color: #4caf50; }

    .user-summary-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .user-summary-count {
      font-size: 1.5rem;
      font-weight: 800;
      color: #333;
    }

    .user-summary-label {
      font-size: 0.8rem;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ========== Mobile Cards (Hidden by default) ========== */
    .mobile-cards {
      display: none;
    }

    .mobile-card {
      background: white;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      border: 1px solid #f0f0f0;
    }

    .mobile-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .mobile-card-body h4 {
      margin: 0 0 8px 0;
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .mobile-card-body .complaint-desc {
      font-size: 0.85rem;
      color: #666;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .mobile-card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }

    .date-text {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.8rem;
      color: #888;
    }

    .date-text mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .mobile-card-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mobile-card-footer label {
      font-size: 0.85rem;
      font-weight: 500;
      color: #555;
      white-space: nowrap;
    }

    .assign-select-mobile {
      flex: 1;
    }

    ::ng-deep .assign-select-mobile .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    /* User Card Styles */
    .user-card-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }

    .user-avatar-large {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      color: white;
      flex-shrink: 0;
    }

    .user-card-info h4 {
      margin: 0 0 6px 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .user-card-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .user-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: #555;
    }

    .user-detail mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #888;
    }

    /* ========== Tables ========== */
    .table-wrapper {
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e8ecef;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .modern-table {
      width: 100%;
    }

    ::ng-deep .modern-table .mat-mdc-header-row {
      background: #f8f9fa;
    }

    ::ng-deep .modern-table .mat-mdc-header-cell {
      font-weight: 600;
      color: #555;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px 12px;
    }

    ::ng-deep .modern-table .mat-mdc-cell {
      padding: 12px;
      color: #333;
      font-size: 0.875rem;
    }

    .table-row {
      transition: background 0.2s ease;
    }

    .table-row:hover {
      background: #f8f9fa;
    }

    /* Table Cell Styles */
    .id-badge {
      background: #e3f2fd;
      color: #1565c0;
      padding: 5px 10px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .title-cell {
      display: flex;
      flex-direction: column;
      max-width: 250px;
    }

    .complaint-title {
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .complaint-desc {
      font-size: 0.75rem;
      color: #888;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .category-chip {
      background: #f3e5f5;
      color: #7b1fa2;
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }

    .status-open { background: #fff3e0; color: #e65100; }
    .status-open .status-dot { background: #e65100; }

    .status-assigned { background: #e3f2fd; color: #1565c0; }
    .status-assigned .status-dot { background: #1565c0; }

    .status-in-progress { background: #fce4ec; color: #c2185b; }
    .status-in-progress .status-dot { background: #c2185b; }

    .status-resolved { background: #e8f5e9; color: #2e7d32; }
    .status-resolved .status-dot { background: #2e7d32; }

    .date-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 0.85rem;
    }

    .date-cell mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    /* Assign Select */
    .assign-select {
      width: 140px;
    }

    ::ng-deep .assign-select .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    ::ng-deep .assign-select .mat-mdc-text-field-wrapper {
      padding: 0 10px;
    }

    .staff-option {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .staff-avatar {
      width: 26px;
      height: 26px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.75rem;
    }

    /* User Table Styles */
    .user-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .avatar-admin { background: linear-gradient(135deg, #e91e63, #c2185b); }
    .avatar-staff { background: linear-gradient(135deg, #2196f3, #1565c0); }
    .avatar-user { background: linear-gradient(135deg, #4caf50, #2e7d32); }

    .user-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .email-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 0.85rem;
    }

    .email-cell mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .role-badge mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .role-admin { background: #fce4ec; color: #c2185b; }
    .role-staff { background: #e3f2fd; color: #1565c0; }
    .role-user { background: #e8f5e9; color: #2e7d32; }

    .contact-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #666;
      font-size: 0.85rem;
    }

    .contact-cell mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #999;
    }

    .no-data-text {
      color: #bbb;
      font-style: italic;
      font-size: 0.85rem;
    }

    /* Role Chips */
    .role-chips {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .role-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 2px solid transparent;
    }

    .role-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .chip-count {
      opacity: 0.8;
    }

    .role-chip.all { background: #f5f5f5; color: #666; }
    .role-chip.all.active { background: #333; color: white; border-color: #333; }

    .role-chip.admin { background: #fce4ec; color: #c2185b; }
    .role-chip.admin.active { background: #c2185b; color: white; border-color: #c2185b; }

    .role-chip.staff { background: #e3f2fd; color: #1565c0; }
    .role-chip.staff.active { background: #1565c0; color: white; border-color: #1565c0; }

    .role-chip.user { background: #e8f5e9; color: #2e7d32; }
    .role-chip.user.active { background: #2e7d32; color: white; border-color: #2e7d32; }

    .role-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    /* Empty & No Data States */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .empty-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #ccc;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 1.125rem;
    }

    .empty-state p {
      margin: 0;
      color: #999;
      font-size: 0.9rem;
    }

    .no-data {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    /* ========================================================
       RESPONSIVE BREAKPOINTS
       ======================================================== */

    /* 14-inch Laptop (1366px) */
    @media (max-width: 1400px) {
      .header {
        padding: 20px 24px;
      }

      .header-text h1 {
        font-size: 1.375rem;
      }

      .main-content {
        padding: 20px;
      }

      .stats-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
      }

      .stat-card {
        padding: 16px;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .stat-text {
        font-size: 0.75rem;
      }

      .stat-card-icon {
        width: 44px;
        height: 44px;
      }

      .stat-card-icon mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .resolution-percentage {
        font-size: 2.25rem;
      }

      .category-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }

      .user-summary-grid {
        gap: 12px;
      }

      .user-summary-card {
        padding: 16px;
      }

      .user-summary-count {
        font-size: 1.375rem;
      }

      .title-cell {
        max-width: 200px;
      }
    }

    /* Small Laptop / Large Tablet (1024px - 1200px) */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .category-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .title-cell {
        max-width: 180px;
      }

      .assign-select {
        width: 120px;
      }
    }

    /* Tablet Landscape (768px - 1024px) */
    @media (max-width: 1024px) {
      .header {
        padding: 18px 20px;
      }

      .header-container {
        flex-direction: column;
        text-align: center;
      }

      .header-left {
        flex-direction: column;
        text-align: center;
      }

      .header-right {
        width: 100%;
        justify-content: center;
      }

      .main-content {
        padding: 16px;
      }

      .tab-content {
        padding: 20px;
      }

      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .stat-card {
        padding: 14px;
        flex-direction: column;
        text-align: center;
        gap: 10px;
      }

      .stat-number {
        font-size: 1.5rem;
      }

      .resolution-card {
        padding: 20px;
      }

      .resolution-percentage {
        font-size: 2rem;
      }

      .user-summary-grid {
        grid-template-columns: repeat(3, 1fr);
      }

      .user-summary-card {
        flex-direction: column;
        text-align: center;
        padding: 14px;
        gap: 10px;
      }

      /* Show scrollable table */
      .table-wrapper {
        overflow-x: auto;
      }

      .modern-table {
        min-width: 700px;
      }
    }

    /* Tablet Portrait (600px - 768px) */
    @media (max-width: 768px) {
      .header {
        padding: 16px;
      }

      .header-icon-wrapper {
        width: 48px;
        height: 48px;
      }

      .header-icon-wrapper mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .header-text h1 {
        font-size: 1.25rem;
      }

      .header-text p {
        font-size: 0.8rem;
      }

      .header-stat {
        padding: 8px 14px;
      }

      .header-stat-value {
        font-size: 1.25rem;
      }

      .header-stat-label {
        font-size: 0.7rem;
      }

      .main-content {
        padding: 12px;
      }

      ::ng-deep .dashboard-tabs .mat-mdc-tab {
        height: 52px;
        min-width: 80px;
        padding: 0 12px;
      }

      .tab-text {
        display: none;
      }

      .tab-label mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
      }

      .tab-content {
        padding: 16px;
      }

      .section-title h2 {
        font-size: 1rem;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .refresh-btn {
        width: 100%;
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .stat-card {
        padding: 12px;
      }

      .stat-card-icon {
        width: 40px;
        height: 40px;
      }

      .stat-card-icon mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .stat-number {
        font-size: 1.25rem;
      }

      .resolution-card {
        padding: 16px;
      }

      .resolution-percentage {
        font-size: 1.75rem;
      }

      .resolution-text {
        font-size: 0.8rem;
      }

      .category-grid {
        grid-template-columns: 1fr;
      }

      .user-summary-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .user-summary-card {
        flex-direction: row;
        text-align: left;
      }

      .role-chips {
        gap: 8px;
      }

      .role-chip {
        padding: 6px 10px;
        font-size: 0.8rem;
      }

      .chip-text {
        display: none;
      }

      /* Hide table, show mobile cards */
      .table-wrapper {
        display: none;
      }

      .mobile-cards {
        display: block;
      }
    }

    /* Mobile Large (480px - 600px) */
    @media (max-width: 600px) {
      .header-container {
        gap: 12px;
      }

      .header-right {
        gap: 10px;
      }

      .header-stat {
        padding: 6px 12px;
        flex: 1;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }

      .stat-card {
        padding: 10px;
        gap: 8px;
      }

      .stat-card-icon {
        width: 36px;
        height: 36px;
      }

      .stat-card-icon mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .stat-number {
        font-size: 1.125rem;
      }

      .stat-text {
        font-size: 0.7rem;
      }

      .resolution-percentage {
        font-size: 1.5rem;
      }

      .resolution-bar {
        height: 8px;
      }

      .category-card {
        padding: 12px;
      }

      .category-bar {
        width: 50px;
      }

      .role-chips {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 8px;
        -webkit-overflow-scrolling: touch;
      }

      .role-chip {
        flex-shrink: 0;
      }

      .mobile-card {
        padding: 14px;
      }

      .mobile-card-body h4 {
        font-size: 0.95rem;
      }

      .empty-icon {
        width: 60px;
        height: 60px;
      }

      .empty-icon mat-icon {
        font-size: 30px;
        width: 30px;
        height: 30px;
      }

      .empty-state h3 {
        font-size: 1rem;
      }
    }

    /* Mobile Small (320px - 480px) */
    @media (max-width: 480px) {
      .header {
        padding: 12px;
      }

      .header-icon-wrapper {
        width: 42px;
        height: 42px;
      }

      .header-icon-wrapper mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .header-text h1 {
        font-size: 1.125rem;
      }

      .header-text p {
        font-size: 0.75rem;
      }

      .header-stat-value {
        font-size: 1.125rem;
      }

      .main-content {
        padding: 8px;
      }

      .tab-content {
        padding: 12px;
      }

      .section-title {
        margin-bottom: 12px;
      }

      .section-title h2 {
        font-size: 0.95rem;
      }

      .stats-grid {
        gap: 6px;
      }

      .stat-card {
        padding: 8px;
        border-radius: 10px;
      }

      .stat-card-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }

      .stat-card-icon mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .stat-number {
        font-size: 1rem;
      }

      .resolution-card {
        padding: 14px;
        border-radius: 10px;
      }

      .resolution-header h3 {
        font-size: 0.9rem;
      }

      .resolution-percentage {
        font-size: 1.375rem;
        margin-bottom: 8px;
      }

      .category-card {
        padding: 10px;
        border-radius: 8px;
      }

      .category-count {
        font-size: 1rem;
      }

      .category-bar {
        width: 40px;
        height: 5px;
      }

      .user-summary-card {
        padding: 12px;
        border-radius: 10px;
      }

      .user-summary-card mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .user-summary-count {
        font-size: 1.25rem;
      }

      .user-summary-label {
        font-size: 0.75rem;
      }

      .role-chip {
        padding: 5px 8px;
        font-size: 0.75rem;
        border-radius: 16px;
      }

      .role-chip mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .mobile-card {
        padding: 12px;
        border-radius: 10px;
      }

      .mobile-card-body h4 {
        font-size: 0.9rem;
      }

      .mobile-card-body .complaint-desc {
        font-size: 0.8rem;
      }

      .id-badge {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .status-badge {
        padding: 4px 8px;
        font-size: 0.7rem;
      }

      .status-dot {
        width: 6px;
        height: 6px;
      }

      .category-chip {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .user-avatar-large {
        width: 44px;
        height: 44px;
        font-size: 1.125rem;
      }

      .user-card-info h4 {
        font-size: 0.95rem;
      }

      .user-detail {
        font-size: 0.8rem;
      }

      .user-detail mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .empty-state {
        padding: 40px 16px;
      }

      .empty-icon {
        width: 50px;
        height: 50px;
      }

      .empty-icon mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .empty-state h3 {
        font-size: 0.95rem;
      }

      .empty-state p {
        font-size: 0.8rem;
      }
    }

    /* Extra Small Devices (below 320px) */
    @media (max-width: 320px) {
      .header-left {
        gap: 10px;
      }

      .header-icon-wrapper {
        width: 38px;
        height: 38px;
      }

      .header-text h1 {
        font-size: 1rem;
      }

      .header-right {
        gap: 6px;
      }

      .header-stat {
        padding: 5px 8px;
      }

      .header-stat-value {
        font-size: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stat-card {
        flex-direction: row;
        text-align: left;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  // Data
  stats: any = null;
  allComplaints: Complaint[] = [];
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  staffMembers: User[] = [];
  categoryStats: any[] = [];

  // Computed stats
  totalComplaints = 0;
  openCount = 0;
  assignedCount = 0;
  inProgressCount = 0;
  resolvedCount = 0;
  resolutionRate = 0;

  // Loading states
  isLoadingStats = false;
  isLoadingComplaints = false;
  isLoadingUsers = false;

  // Filters
  selectedRole = 'all';

  // Table columns
  complaintColumns = ['id', 'title', 'category', 'status', 'created', 'assign'];
  userColumns = ['id', 'name', 'email', 'role', 'contact'];

  constructor(
    private complaintService: ComplaintService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStaffMembers();
    this.loadStatistics();
    this.loadAllComplaints();
    this.loadAllUsers();
  }

  loadStatistics(): void {
    this.isLoadingStats = true;
    this.complaintService.getStatistics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats = response.data;
          this.calculateStats();
        }
      },
      error: () => {
        this.showError('Failed to load statistics');
        this.calculateStatsFromComplaints();
      },
      complete: () => {
        this.isLoadingStats = false;
      }
    });
  }

  calculateStats(): void {
    if (this.stats?.overall?.[0]) {
      const overall = this.stats.overall[0];
      this.totalComplaints = overall.total || 0;
      this.openCount = overall.open_count || 0;
      this.assignedCount = overall.assigned_count || 0;
      this.inProgressCount = overall.in_progress_count || 0;
      this.resolvedCount = overall.resolved_count || 0;
    } else {
      this.calculateStatsFromComplaints();
    }

    this.resolutionRate = this.totalComplaints > 0 
      ? Math.round((this.resolvedCount / this.totalComplaints) * 100) 
      : 0;

    if (this.stats?.byCategory) {
      this.categoryStats = this.stats.byCategory;
    }
  }

  calculateStatsFromComplaints(): void {
    this.totalComplaints = this.allComplaints.length;
    this.openCount = this.allComplaints.filter(c => c.status === 'open').length;
    this.assignedCount = this.allComplaints.filter(c => c.status === 'assigned').length;
    this.inProgressCount = this.allComplaints.filter(c => c.status === 'in-progress').length;
    this.resolvedCount = this.allComplaints.filter(c => c.status === 'resolved').length;
    
    this.resolutionRate = this.totalComplaints > 0 
      ? Math.round((this.resolvedCount / this.totalComplaints) * 100) 
      : 0;

    const categoryMap = new Map<string, number>();
    this.allComplaints.forEach(c => {
      const count = categoryMap.get(c.category) || 0;
      categoryMap.set(c.category, count + 1);
    });
    this.categoryStats = Array.from(categoryMap, ([category, count]) => ({ category, count }));
  }

  loadAllComplaints(): void {
    this.isLoadingComplaints = true;
    this.complaintService.getAllComplaints().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allComplaints = response.data;
          this.setDefaultStaffAssignment();
          if (!this.stats) {
            this.calculateStatsFromComplaints();
          }
        }
      },
      error: () => {
        this.showError('Failed to load complaints');
      },
      complete: () => {
        this.isLoadingComplaints = false;
      }
    });
  }

  setDefaultStaffAssignment(): void {
    if (this.staffMembers.length > 0) {
      const defaultStaff = this.staffMembers[0];
      this.allComplaints.forEach(complaint => {
        if (!complaint.staff_id) {
          complaint.staff_id = defaultStaff.id;
        }
      });
    }
  }

  loadAllUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allUsers = response.data;
          this.filteredUsers = [...this.allUsers];
        }
      },
      error: () => {
        this.showError('Failed to load users');
      },
      complete: () => {
        this.isLoadingUsers = false;
      }
    });
  }

  loadStaffMembers(): void {
    this.userService.getStaffMembers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.staffMembers = response.data;
          if (this.allComplaints.length > 0) {
            this.setDefaultStaffAssignment();
          }
        }
      },
      error: () => {
        this.showError('Failed to load staff members');
      }
    });
  }

  assignComplaint(complaintId: number, staffId: number): void {
    if (staffId) {
      this.complaintService.assignToStaff(complaintId, staffId).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Complaint assigned successfully!', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.loadStatistics();
          }
        },
        error: () => {
          this.showError('Failed to assign complaint');
        }
      });
    }
  }

  filterByRole(role: string): void {
    this.selectedRole = role;
    if (role === 'all') {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter(u => u.role === role);
    }
  }

  getCategoryPercentage(count: number): number {
    return this.totalComplaints > 0 ? (count / this.totalComplaints) * 100 : 0;
  }

  formatStatus(status: string): string {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getUserCountByRole(role: string): number {
    return this.allUsers.filter(u => u.role === role).length;
  }

  getRoleIcon(role: string): string {
    const icons: { [key: string]: string } = {
      'admin': 'shield',
      'staff': 'support_agent',
      'user': 'person'
    };
    return icons[role] || 'person';
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}