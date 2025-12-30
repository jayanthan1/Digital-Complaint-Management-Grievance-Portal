import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FilterService, FilterOptions } from '../../../core/services/filter.service';

@Component({
  selector: 'app-complaint-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mat-expansion-panel class="filter-panel">
      <mat-expansion-panel-header class="filter-header">
        <mat-panel-title>
          <mat-icon>filter_list</mat-icon>
          Advanced Filters {{ getActiveFilterCount() > 0 ? '(' + getActiveFilterCount() + ')' : '' }}
        </mat-panel-title>
        <mat-panel-description>
          Filter complaints by multiple criteria
        </mat-panel-description>
      </mat-expansion-panel-header>

      <form [formGroup]="filterForm" class="filter-form">
        <div class="filter-section">
          <h3>Search</h3>
          <mat-form-field appearance="outline">
            <mat-label>Search by ID, Title, or Description</mat-label>
            <input matInput formControlName="searchTerm" type="text">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>

        <div class="filter-section">
          <h3>Status</h3>
          <div class="checkbox-group">
            <mat-checkbox 
              *ngFor="let status of statusOptions"
              [formControl]="getStatusControl(status)">
              <span class="status-label" [ngClass]="'status-' + status.toLowerCase()">
                {{ status }}
              </span>
            </mat-checkbox>
          </div>
        </div>

        <div class="filter-section">
          <h3>Priority</h3>
          <div class="checkbox-group">
            <mat-checkbox 
              *ngFor="let priority of priorityOptions"
              [formControl]="getPriorityControl(priority)">
              <span class="priority-label" [ngClass]="'priority-' + priority.toLowerCase()">
                {{ priority }}
              </span>
            </mat-checkbox>
          </div>
        </div>

        <div class="filter-section">
          <h3>Category</h3>
          <div class="checkbox-group">
            <mat-checkbox 
              *ngFor="let category of categoryOptions"
              [formControl]="getCategoryControl(category)">
              {{ category }}
            </mat-checkbox>
          </div>
        </div>

        <div class="filter-section">
          <h3>Date Range</h3>
          <div class="date-range-group">
            <mat-form-field appearance="outline">
              <mat-label>From Date</mat-label>
              <input matInput [matDatepicker]="fromDatePicker" formControlName="fromDate">
              <mat-datepicker-toggle matIconSuffix [for]="fromDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #fromDatePicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>To Date</mat-label>
              <input matInput [matDatepicker]="toDatePicker" formControlName="toDate">
              <mat-datepicker-toggle matIconSuffix [for]="toDatePicker"></mat-datepicker-toggle>
              <mat-datepicker #toDatePicker></mat-datepicker>
            </mat-form-field>
          </div>
        </div>

        <div class="filter-section">
          <h3>Sorting</h3>
          <div class="sort-options">
            <mat-form-field appearance="outline">
              <mat-label>Sort By</mat-label>
              <mat-select formControlName="sortBy">
                <mat-option value="created_at">Most Recent</mat-option>
                <mat-option value="updated_at">Recently Updated</mat-option>
                <mat-option value="priority">Priority (High to Low)</mat-option>
                <mat-option value="status">Status</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Order</mat-label>
              <mat-select formControlName="sortOrder">
                <mat-option value="desc">Descending</mat-option>
                <mat-option value="asc">Ascending</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <div class="filter-actions">
          <button 
            mat-raised-button 
            color="primary"
            (click)="applyFilters()"
            class="apply-btn">
            <mat-icon>done</mat-icon>
            Apply Filters
          </button>
          <button 
            mat-stroked-button
            (click)="resetFilters()"
            class="reset-btn">
            <mat-icon>refresh</mat-icon>
            Reset
          </button>
        </div>
      </form>
    </mat-expansion-panel>
  `,
  styles: [`
    .filter-panel {
      margin-bottom: 20px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filter-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      mat-panel-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: white;

        mat-icon {
          color: white;
        }
      }

      mat-panel-description {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .filter-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 12px;

      h3 {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: #1f2937;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    mat-form-field {
      width: 100%;
    }

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;

      mat-checkbox {
        padding: 8px;

        ::ng-deep .mdc-checkbox__native-control {
          cursor: pointer;
        }
      }
    }

    .status-label,
    .priority-label {
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;

      &.status-open {
        background-color: rgba(251, 191, 36, 0.1);
        color: #92400e;
      }

      &.status-assigned {
        background-color: rgba(96, 165, 250, 0.1);
        color: #1e40af;
      }

      &.status-in-progress {
        background-color: rgba(249, 115, 22, 0.1);
        color: #92400e;
      }

      &.status-resolved {
        background-color: rgba(16, 185, 129, 0.1);
        color: #065f46;
      }

      &.priority-low {
        background-color: rgba(16, 185, 129, 0.1);
        color: #065f46;
      }

      &.priority-medium {
        background-color: rgba(245, 158, 11, 0.1);
        color: #92400e;
      }

      &.priority-high {
        background-color: rgba(239, 68, 68, 0.1);
        color: #7f1d1d;
      }
    }

    .date-range-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .sort-options {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 12px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .filter-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;

      button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 40px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      .apply-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .reset-btn {
        color: #667eea;
        border-color: #667eea;

        &:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }
      }
    }

    @media (max-width: 768px) {
      .filter-form {
        padding: 16px;
        gap: 16px;
      }

      .checkbox-group {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }
    }
  `]
})
export class ComplaintFilterComponent implements OnInit {
  @Output() filterApplied = new EventEmitter<FilterOptions>();

  filterForm: FormGroup;
  statusOptions: string[] = [];
  priorityOptions: string[] = [];
  categoryOptions: string[] = [];

  private selectedStatuses = new Set<string>();
  private selectedPriorities = new Set<string>();
  private selectedCategories = new Set<string>();

  constructor(private fb: FormBuilder, private filterService: FilterService) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      fromDate: [null],
      toDate: [null],
      sortBy: ['created_at'],
      sortOrder: ['desc']
    });

    this.statusOptions = this.filterService.getStatusOptions();
    this.priorityOptions = this.filterService.getPriorityOptions();
    this.categoryOptions = this.filterService.getCategoryOptions();

    // Initialize all status/priority/category controls to false
    this.statusOptions.forEach(status => {
      this.filterForm.addControl(`status_${status}`, this.fb.control(false));
    });
    this.priorityOptions.forEach(priority => {
      this.filterForm.addControl(`priority_${priority}`, this.fb.control(false));
    });
    this.categoryOptions.forEach(category => {
      this.filterForm.addControl(`category_${category}`, this.fb.control(false));
    });
  }

  ngOnInit(): void {
    // Form initialization complete
  }

  getStatusControl(status: string) {
    return this.filterForm.get(`status_${status}`);
  }

  getPriorityControl(priority: string) {
    return this.filterForm.get(`priority_${priority}`);
  }

  getCategoryControl(category: string) {
    return this.filterForm.get(`category_${category}`);
  }

  applyFilters(): void {
    this.updateSelectedValues();

    const filterOptions: FilterOptions = {
      searchTerm: this.filterForm.get('searchTerm')?.value || '',
      statuses: Array.from(this.selectedStatuses),
      priorities: Array.from(this.selectedPriorities),
      categories: Array.from(this.selectedCategories),
      fromDate: this.filterForm.get('fromDate')?.value,
      toDate: this.filterForm.get('toDate')?.value,
      sortBy: this.filterForm.get('sortBy')?.value,
      sortOrder: this.filterForm.get('sortOrder')?.value as 'asc' | 'desc'
    };

    this.filterApplied.emit(filterOptions);
  }

  resetFilters(): void {
    this.filterForm.reset({
      searchTerm: '',
      fromDate: null,
      toDate: null,
      sortBy: 'created_at',
      sortOrder: 'desc'
    });

    this.statusOptions.forEach(status => {
      this.filterForm.get(`status_${status}`)?.setValue(false);
    });
    this.priorityOptions.forEach(priority => {
      this.filterForm.get(`priority_${priority}`)?.setValue(false);
    });
    this.categoryOptions.forEach(category => {
      this.filterForm.get(`category_${category}`)?.setValue(false);
    });

    this.selectedStatuses.clear();
    this.selectedPriorities.clear();
    this.selectedCategories.clear();

    this.applyFilters();
  }

  getActiveFilterCount(): number {
    this.updateSelectedValues();
    let count = 0;

    if (this.filterForm.get('searchTerm')?.value) count++;
    if (this.filterForm.get('fromDate')?.value) count++;
    if (this.filterForm.get('toDate')?.value) count++;
    count += this.selectedStatuses.size;
    count += this.selectedPriorities.size;
    count += this.selectedCategories.size;

    return count;
  }

  private updateSelectedValues(): void {
    this.selectedStatuses.clear();
    this.selectedPriorities.clear();
    this.selectedCategories.clear();

    this.statusOptions.forEach(status => {
      if (this.filterForm.get(`status_${status}`)?.value) {
        this.selectedStatuses.add(status);
      }
    });

    this.priorityOptions.forEach(priority => {
      if (this.filterForm.get(`priority_${priority}`)?.value) {
        this.selectedPriorities.add(priority);
      }
    });

    this.categoryOptions.forEach(category => {
      if (this.filterForm.get(`category_${category}`)?.value) {
        this.selectedCategories.add(category);
      }
    });
  }
}
