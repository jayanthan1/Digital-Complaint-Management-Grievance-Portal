import { Injectable } from '@angular/core';
import { Complaint } from '../../shared/models';

export interface FilterOptions {
  status?: string[];
  priority?: string[];
  category?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

export interface SortOption {
  field: 'title' | 'status' | 'priority' | 'created_at' | 'updated_at';
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  filterComplaints(complaints: Complaint[], filters: FilterOptions): Complaint[] {
    return complaints.filter(complaint => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(complaint.status)) return false;
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        const complaintPriority = complaint.priority || 'medium';
        if (!filters.priority.includes(complaintPriority)) return false;
      }

      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(complaint.category)) return false;
      }

      // Date range filter
      if (filters.dateFrom && complaint.created_at) {
        if (new Date(complaint.created_at) < filters.dateFrom) return false;
      }
      if (filters.dateTo && complaint.created_at) {
        if (new Date(complaint.created_at) > filters.dateTo) return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesTitle = complaint.title.toLowerCase().includes(term);
        const matchesDescription = complaint.description.toLowerCase().includes(term);
        const matchesId = complaint.id.toString().includes(term);
        if (!matchesTitle && !matchesDescription && !matchesId) return false;
      }

      return true;
    });
  }

  sortComplaints(complaints: Complaint[], sort: SortOption): Complaint[] {
    const sorted = [...complaints];
    sorted.sort((a, b) => {
      let aValue: any = a[sort.field];
      let bValue: any = b[sort.field];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to lowercase for string comparison
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  getStatusOptions(): string[] {
    return ['open', 'assigned', 'in-progress', 'resolved'];
  }

  getPriorityOptions(): string[] {
    return ['low', 'medium', 'high'];
  }

  getCategoryOptions(): string[] {
    return ['technical', 'billing', 'service', 'product', 'general', 'maintenance', 'security', 'network'];
  }
}
