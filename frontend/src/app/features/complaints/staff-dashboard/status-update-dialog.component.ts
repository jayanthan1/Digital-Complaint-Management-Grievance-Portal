import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Complaint } from '../../../shared/models';

@Component({
  selector: 'app-status-update-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>edit_note</mat-icon>
        Update Complaint Status
      </h2>
      
      <mat-dialog-content class="dialog-content">
        <div class="complaint-info" *ngIf="data?.complaint">
          <div class="info-field">
            <label>Complaint ID</label>
            <div class="info-value">#{{ data.complaint.id || 'N/A' }}</div>
          </div>
          <div class="info-field">
            <label>Title</label>
            <div class="info-value">{{ data.complaint.title || 'N/A' }}</div>
          </div>
          <div class="info-field">
            <label>Current Status</label>
            <div class="info-value status-badge" [ngClass]="'status-' + (data.complaint.status || 'open')">
              {{ (data.complaint.status || 'open') | uppercase }}
            </div>
          </div>
        </div>

        <mat-form-field appearance="outline" class="status-select" *ngIf="data?.statusOptions && data.statusOptions.length > 0">
          <mat-label>New Status</mat-label>
          <mat-icon matPrefix>done_all</mat-icon>
          <mat-select [(value)]="selectedStatus">
            <mat-option *ngFor="let status of data.statusOptions" [value]="status">
              {{ status | uppercase }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!isStatusChanged()">
          <mat-icon>check</mat-icon>
          Update Status
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #1e293b;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .dialog-content {
      padding: 24px 0;
    }

    .complaint-info {
      background: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 4px solid #667eea;
    }

    .info-field {
      margin-bottom: 12px;
    }

    .info-field:last-child {
      margin-bottom: 0;
    }

    .info-field label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 4px;
      text-decoration: none;
    }

    .info-value {
      font-size: 1rem;
      color: #1e293b;
      font-weight: 500;
    }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      text-decoration: none;
    }

    .status-badge.status-open {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.status-assigned {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.status-in-progress {
      background: #fecaca;
      color: #7f1d1d;
    }

    .status-badge.status-resolved {
      background: #bbf7d0;
      color: #065f46;
    }

    .status-select {
      width: 100%;
      margin-bottom: 16px !important;
      margin-top: 8px;
    }

    /* Fix Material form field label strikethrough */
    .status-select /deep/ .mdc-floating-label {
      text-decoration: none !important;
      text-decoration-line: none !important;
    }

    .status-select /deep/ .mat-mdc-floating-label {
      text-decoration: none !important;
      text-decoration-line: none !important;
    }

    .status-select /deep/ .mat-mdc-form-field-label {
      text-decoration: none !important;
      text-decoration-line: none !important;
      line-height: 1.5 !important;
    }

    .status-select /deep/ .mdc-text-field--filled .mdc-floating-label {
      text-decoration: none !important;
    }

    .status-select /deep/ .mdc-text-field--filled .mdc-floating-label.mdc-floating-label--float-above {
      text-decoration: none !important;
    }

    /* Focused state */
    .status-select /deep/ .mdc-text-field--focused .mdc-floating-label {
      text-decoration: none !important;
    }

    .status-select /deep/ .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      text-decoration: none !important;
    }

    /* Additional Material overrides for outline variant */
    ::ng-deep .status-select .mdc-notched-outline__leading {
      border-color: #e2e8f0 !important;
    }

    ::ng-deep .status-select .mdc-notched-outline__notch {
      border-color: #e2e8f0 !important;
    }

    ::ng-deep .status-select .mdc-notched-outline__trailing {
      border-color: #e2e8f0 !important;
    }

    ::ng-deep .status-select .mdc-text-field__input {
      color: #1e293b !important;
      font-size: 1rem !important;
      font-weight: 500 !important;
    }

    /* Focused outline colors */
    ::ng-deep .status-select.mat-mdc-form-field-focused .mdc-notched-outline__leading {
      border-color: #667eea !important;
    }

    ::ng-deep .status-select.mat-mdc-form-field-focused .mdc-notched-outline__notch {
      border-color: #667eea !important;
    }

    ::ng-deep .status-select.mat-mdc-form-field-focused .mdc-notched-outline__trailing {
      border-color: #667eea !important;
    }

    /* Floating label positioning */
    ::ng-deep .status-select .mdc-floating-label--float-above {
      transform: translateY(-100%) scale(0.75) !important;
      text-decoration: none !important;
    }

    /* Hover state */
    ::ng-deep .status-select:hover .mdc-notched-outline {
      border-color: #cbd5e1 !important;
    }

    /* Error state prevention */
    ::ng-deep .status-select .mat-mdc-form-field-error {
      display: none !important;
    }

    /* Mat-option styling */
    ::ng-deep .status-select .mdc-menu__content {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
    }

    ::ng-deep .mat-mdc-option {
      color: #1e293b !important;
    }

    ::ng-deep .mat-mdc-option:hover {
      background: #f1f5f9 !important;
    }

    ::ng-deep .mat-mdc-option.mat-selected {
      background: #eff6ff !important;
      color: #667eea !important;
    }

    .dialog-actions {
      padding: 16px 0 0 0;
      border-top: 1px solid #e2e8f0;
      gap: 12px;
    }

    mat-icon {
      margin-right: 8px;
    }
  `]
})
export class StatusUpdateDialogComponent {
  selectedStatus: string;

  constructor(
    public dialogRef: MatDialogRef<StatusUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { complaint: Complaint; statusOptions: string[] }
  ) {
    this.selectedStatus = data?.complaint?.status || 'open';
    if (!this.data?.statusOptions || this.data.statusOptions.length === 0) {
      this.data.statusOptions = ['open', 'assigned', 'in-progress', 'resolved'];
    }
  }

  isStatusChanged(): boolean {
    return this.selectedStatus && this.selectedStatus !== this.data?.complaint?.status;
  }

  onSubmit(): void {
    if (this.isStatusChanged()) {
      this.dialogRef.close({ status: this.selectedStatus });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
