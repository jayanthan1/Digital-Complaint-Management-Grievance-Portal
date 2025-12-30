# Quick Start: Integrating New Frontend Features

## What You're Getting

✅ **4 New Services**:
- Analytics Service - Calculate and visualize complaint statistics
- Notification Service - System-wide notification management
- Filter Service - Advanced filtering and sorting
- Export Service - Multi-format data export with analytics

✅ **4 New UI Components**:
- Notification Center - Toast notifications display
- Complaint Statistics - Analytics dashboard
- Complaint Filter - Advanced filter panel
- Export Data - Bulk export functionality

---

## 5-Minute Integration

### 1. Update App Component

Add the notification center to your main app layout:

```typescript
// src/app/app.component.ts
import { NotificationCenterComponent } from './shared/components/notification-center/notification-center.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NotificationCenterComponent,
    RouterOutlet,
    // ... your other imports
  ],
  template: `
    <app-notification-center></app-notification-center>
    
    <div class="app-layout">
      <!-- Your main layout -->
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
```

### 2. Update Staff Dashboard

Add filter, statistics, and export to your dashboard:

```typescript
// src/app/features/complaints/staff-dashboard/staff-dashboard.component.ts
import { ComplaintFilterComponent } from '../../../shared/components/complaint-filter/complaint-filter.component';
import { ComplaintStatisticsComponent } from '../../../shared/components/complaint-statistics/complaint-statistics.component';
import { ExportDataComponent } from '../../../shared/components/export-data/export-data.component';
import { FilterOptions, FilterService } from '../../../core/services/filter.service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    // ... other imports
    ComplaintFilterComponent,
    ComplaintStatisticsComponent,
    ExportDataComponent
  ],
  template: `
    <!-- Filter Panel -->
    <app-complaint-filter 
      (filterApplied)="onFilterApplied($event)">
    </app-complaint-filter>

    <!-- Statistics Dashboard -->
    <app-complaint-statistics 
      [complaints]="filteredComplaints || complaints">
    </app-complaint-statistics>

    <!-- Export Button -->
    <div class="toolbar">
      <app-export-data 
        [complaints]="filteredComplaints || complaints"
        [selectedCount]="0">
      </app-export-data>
    </div>

    <!-- Your existing table -->
    <mat-table [dataSource]="filteredComplaints || complaints">
      <!-- ... existing columns ... -->
    </mat-table>
  `
})
export class StaffDashboardComponent implements OnInit {
  complaints: Complaint[] = [];
  filteredComplaints: Complaint[] = [];

  constructor(
    private complaintService: ComplaintService,
    private filterService: FilterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  loadComplaints(): void {
    this.complaintService.getComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.filteredComplaints = data;
        this.notificationService.showSuccess(
          'Loaded',
          `${data.length} complaints loaded`
        );
      },
      error: (err) => {
        this.notificationService.showError(
          'Error',
          'Failed to load complaints'
        );
      }
    });
  }

  onFilterApplied(filterOptions: FilterOptions): void {
    this.filteredComplaints = this.filterService.filterComplaints(
      this.complaints,
      filterOptions
    );
    
    this.notificationService.showInfo(
      'Filter Applied',
      `Showing ${this.filteredComplaints.length} of ${this.complaints.length} complaints`
    );
  }
}
```

### 3. Use Notifications in Your Code

Show notifications for user actions:

```typescript
// Example: Update complaint status
updateComplaintStatus(id: number, newStatus: string): void {
  this.complaintService.updateStatus(id, newStatus).subscribe({
    next: () => {
      this.notificationService.showSuccess(
        'Status Updated',
        `Complaint #${id} status changed to ${newStatus}`
      );
      this.loadComplaints(); // Refresh data
    },
    error: (err) => {
      this.notificationService.showError(
        'Update Failed',
        'Could not update complaint status'
      );
    }
  });
}

// Example: With action button
deleteComplaint(id: number): void {
  this.notificationService.show({
    title: 'Delete Complaint?',
    message: 'This action cannot be undone.',
    type: 'warning',
    duration: 0, // Don't auto-dismiss
    action: {
      label: 'Delete',
      callback: () => {
        this.complaintService.deleteComplaint(id).subscribe({
          next: () => {
            this.notificationService.showSuccess(
              'Deleted',
              'Complaint has been deleted'
            );
            this.loadComplaints();
          }
        });
      }
    }
  });
}
```

### 4. Display Analytics (Optional)

Add analytics to admin dashboard:

```typescript
// src/app/features/admin/admin-dashboard.component.ts
import { ComplaintStatisticsComponent } from '../../../shared/components/complaint-statistics/complaint-statistics.component';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ComplaintStatisticsComponent,
    // ... other imports
  ],
  template: `
    <h1>Dashboard</h1>
    
    <app-complaint-statistics 
      [complaints]="allComplaints">
    </app-complaint-statistics>
  `
})
export class AdminDashboardComponent implements OnInit {
  allComplaints: Complaint[] = [];

  constructor(
    private complaintService: ComplaintService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.complaintService.getComplaints().subscribe(complaints => {
      this.allComplaints = complaints;
    });
  }
}
```

---

## File Structure

```
frontend/src/app/
├── core/services/
│   ├── analytics.service.ts          ✨ NEW
│   ├── notification.service.ts       ✨ UPDATED
│   ├── filter.service.ts             ✨ NEW
│   └── export.service.ts             ✨ NEW
├── shared/components/
│   ├── notification-center/
│   │   └── notification-center.component.ts    ✨ NEW
│   ├── complaint-statistics/
│   │   └── complaint-statistics.component.ts   ✨ NEW
│   ├── complaint-filter/
│   │   └── complaint-filter.component.ts       ✨ NEW
│   └── export-data/
│       └── export-data.component.ts            ✨ NEW
└── features/
    └── complaints/
        ├── staff-dashboard/
        │   └── staff-dashboard.component.ts    📝 NEEDS UPDATE
        └── admin/
            └── admin-dashboard.component.ts    📝 OPTIONAL UPDATE
```

---

## Testing the Features

### Test 1: Notifications
```typescript
// In any component, inject NotificationService
constructor(private notificationService: NotificationService) {}

// Call from a button click
testNotifications(): void {
  this.notificationService.showSuccess('Test', 'Success notification');
  this.notificationService.showError('Test', 'Error notification');
  this.notificationService.showWarning('Test', 'Warning notification');
  this.notificationService.showInfo('Test', 'Info notification');
}
```

### Test 2: Filters
1. Click the filter icon in the complaint list
2. Select various filters (status, priority, date range)
3. Click "Apply Filters"
4. Table should update with filtered results

### Test 3: Export
1. Click the "Export" button
2. Select export format (CSV, JSON, or Text)
3. File should download automatically
4. Check success notification

### Test 4: Statistics
1. View the statistics cards at top of dashboard
2. Check values match your database
3. Check distribution bars update correctly

---

## Common Issues & Solutions

### Issue: Notifications not appearing
**Solution**: Make sure `NotificationCenterComponent` is added to app.component.ts

### Issue: Filter not working
**Solution**: Verify complaint data matches expected format:
```typescript
// Required fields
interface Complaint {
  id: number;
  status: string; // 'open', 'assigned', 'in-progress', 'resolved'
  priority?: string; // 'low', 'medium', 'high'
  category?: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}
```

### Issue: Export creating empty files
**Solution**: Ensure complaints array is not empty:
```typescript
if (!this.complaints || this.complaints.length === 0) {
  this.notificationService.showWarning('No Data', 'No complaints to export');
  return;
}
```

---

## Performance Tips

1. **Large Lists**: Consider pagination
   ```typescript
   // Add to filter options
   pageSize: 50;
   pageNumber: 1;
   ```

2. **Real-time Updates**: Use WebSocket for instant notifications
   ```typescript
   // In notification service
   private socket = io('http://localhost:5000');
   
   ngOnInit() {
     this.socket.on('complaint-updated', (data) => {
       this.showInfo('Updated', `Complaint #${data.id} updated`);
     });
   }
   ```

3. **Lazy Load Components**: Use Angular's lazy loading
   ```typescript
   // In routes
   {
     path: 'admin',
     loadComponent: () => import('./admin.component').then(m => m.AdminComponent)
   }
   ```

---

## Next Steps

1. ✅ Add notification center to app layout
2. ✅ Update staff dashboard with filter & statistics
3. ✅ Test all features work correctly
4. ✅ Add export buttons to complaint views
5. ⏭️ (Optional) Add analytics to admin dashboard
6. ⏭️ (Optional) Add real-time WebSocket updates
7. ⏭️ (Optional) Create custom filter presets

---

## Need Help?

Refer to `FRONTEND_ENHANCEMENTS.md` for complete documentation including:
- Detailed service API documentation
- Component usage examples
- Advanced customization options
- Browser compatibility information
