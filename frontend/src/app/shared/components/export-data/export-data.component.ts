import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Complaint } from '../../models';
import { ExportService } from '../../../core/services/export.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-export-data',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="export-container">
      <button 
        mat-raised-button 
        [matMenuTriggerFor]="exportMenu"
        class="export-button"
        matTooltip="Export complaints data">
        <mat-icon>download</mat-icon>
        Export
      </button>

      <mat-menu #exportMenu="matMenu" class="export-menu">
        <!-- Format Selection -->
        <div class="menu-section">
          <div class="menu-title">Export Format</div>
          
          <button 
            mat-menu-item
            (click)="exportToCSV()"
            class="menu-item">
            <mat-icon>description</mat-icon>
            <span>Export as CSV</span>
            <span class="description">Spreadsheet format</span>
          </button>

          <button 
            mat-menu-item
            (click)="exportToJSON()"
            class="menu-item">
            <mat-icon>code</mat-icon>
            <span>Export as JSON</span>
            <span class="description">Data interchange format</span>
          </button>

          <button 
            mat-menu-item
            (click)="exportToText()"
            class="menu-item">
            <mat-icon>article</mat-icon>
            <span>Export as Text</span>
            <span class="description">Plain text format</span>
          </button>
        </div>

        <mat-divider></mat-divider>

        <!-- Statistics -->
        <div class="menu-section">
          <div class="menu-title">Analytics Report</div>
          
          <button 
            mat-menu-item
            (click)="exportStatistics()"
            class="menu-item">
            <mat-icon>assessment</mat-icon>
            <span>Export Statistics</span>
            <span class="description">Summary & analytics</span>
          </button>
        </div>

        <!-- Scope Selection -->
        <mat-divider></mat-divider>
        <div class="menu-section">
          <div class="menu-title scope-title">
            <mat-icon>filter_list</mat-icon>
            Export Scope
          </div>
          
          <div class="scope-info">
            <div class="scope-item">
              <span>Total Selected:</span>
              <strong>{{ selectedCount }} complaint(s)</strong>
            </div>
            <div class="scope-item">
              <span>Total Available:</span>
              <strong>{{ complaints.length }} complaint(s)</strong>
            </div>
          </div>
        </div>
      </mat-menu>

      <!-- Progress Indicator -->
      <div *ngIf="isExporting" class="export-progress">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        <span>Exporting data...</span>
      </div>
    </div>
  `,
  styles: [`
    .export-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .export-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .export-progress {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 8px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 12px;
      color: #6b7280;

      mat-progress-bar {
        height: 3px;
      }
    }

    ::ng-deep .export-menu {
      .mat-mdc-menu-panel {
        max-width: 350px !important;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.16);
        border: 1px solid #e5e7eb;
      }

      .menu-section {
        padding: 8px 0;
      }

      .menu-title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 12px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        &.scope-title {
          color: #1f2937;
          margin-bottom: 8px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: #667eea;
          }
        }
      }

      .menu-item {
        display: flex !important;
        align-items: center;
        gap: 12px;
        padding: 12px 16px !important;
        font-size: 13px;
        color: #1f2937;
        position: relative;
        padding-left: 44px !important;

        mat-icon {
          position: absolute;
          left: 12px;
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #667eea;
        }

        .description {
          display: block;
          font-size: 11px;
          color: #9ca3af;
          font-weight: normal;
          margin-left: auto;
          text-align: right;
        }

        &:hover {
          background-color: #f3f4f6;

          .description {
            color: #6b7280;
          }
        }
      }

      .scope-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px 16px;
        background-color: #f9fafb;
        border-radius: 4px;
        margin: 0 8px;
      }

      .scope-item {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #6b7280;

        strong {
          color: #1f2937;
          font-weight: 600;
        }
      }
    }

    @media (max-width: 640px) {
      .export-button {
        padding: 0 12px;
        font-size: 12px;

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
  `]
})
export class ExportDataComponent {
  @Input() complaints: Complaint[] = [];
  @Input() selectedCount: number = 0;

  isExporting = false;

  constructor(
    private exportService: ExportService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  exportToCSV(): void {
    if (!this.validateComplaints()) return;

    this.isExporting = true;
    try {
      const data = this.selectedCount > 0 
        ? this.complaints.slice(0, this.selectedCount)
        : this.complaints;

      this.exportService.exportToCSV(data);
      this.notificationService.showSuccess(
        'Export Successful',
        `Exported ${data.length} complaint(s) to CSV`
      );
    } catch (error) {
      this.notificationService.showError(
        'Export Failed',
        'Failed to export to CSV. Please try again.'
      );
    } finally {
      this.isExporting = false;
    }
  }

  exportToJSON(): void {
    if (!this.validateComplaints()) return;

    this.isExporting = true;
    try {
      const data = this.selectedCount > 0 
        ? this.complaints.slice(0, this.selectedCount)
        : this.complaints;

      this.exportService.exportToJSON(data);
      this.notificationService.showSuccess(
        'Export Successful',
        `Exported ${data.length} complaint(s) to JSON`
      );
    } catch (error) {
      this.notificationService.showError(
        'Export Failed',
        'Failed to export to JSON. Please try again.'
      );
    } finally {
      this.isExporting = false;
    }
  }

  exportToText(): void {
    if (!this.validateComplaints()) return;

    this.isExporting = true;
    try {
      const data = this.selectedCount > 0 
        ? this.complaints.slice(0, this.selectedCount)
        : this.complaints;

      this.exportService.exportToText(data);
      this.notificationService.showSuccess(
        'Export Successful',
        `Exported ${data.length} complaint(s) to Text`
      );
    } catch (error) {
      this.notificationService.showError(
        'Export Failed',
        'Failed to export to text. Please try again.'
      );
    } finally {
      this.isExporting = false;
    }
  }

  exportStatistics(): void {
    if (!this.validateComplaints()) return;

    this.isExporting = true;
    try {
      const stats = this.exportService.generateStatisticsReport(this.complaints);
      const blob = new Blob([stats], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `complaint-statistics-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      window.URL.revokeObjectURL(url);

      this.notificationService.showSuccess(
        'Export Successful',
        'Statistics report exported successfully'
      );
    } catch (error) {
      this.notificationService.showError(
        'Export Failed',
        'Failed to export statistics. Please try again.'
      );
    } finally {
      this.isExporting = false;
    }
  }

  private validateComplaints(): boolean {
    if (!this.complaints || this.complaints.length === 0) {
      this.notificationService.showWarning(
        'No Data',
        'No complaints available to export'
      );
      return false;
    }
    return true;
  }
}
