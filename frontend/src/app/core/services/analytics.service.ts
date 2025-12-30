import { Injectable } from '@angular/core';
import { Complaint } from '../../shared/models';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface Analytics {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  resolutionRate: number;
  averageResolutionTime: number;
  statusDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  categoryDistribution: Record<string, number>;
  complaintsTrend: { date: string; count: number }[];
  staffPerformance: { staffId: number; resolved: number; pending: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  calculateAnalytics(complaints: Complaint[]): Analytics {
    const resolved = complaints.filter(c => c.status === 'resolved');
    const pending = complaints.filter(c => c.status !== 'resolved');

    return {
      totalComplaints: complaints.length,
      resolvedComplaints: resolved.length,
      pendingComplaints: pending.length,
      resolutionRate: complaints.length > 0 ? (resolved.length / complaints.length) * 100 : 0,
      averageResolutionTime: this.calculateAvgResolutionTime(resolved),
      statusDistribution: this.getDistribution(complaints, c => c.status),
      priorityDistribution: this.getDistribution(complaints, c => c.priority || 'medium'),
      categoryDistribution: this.getDistribution(complaints, c => c.category),
      complaintsTrend: this.getComplaintsTrend(complaints),
      staffPerformance: this.getStaffPerformance(complaints)
    };
  }

  getStatusChartData(analytics: Analytics): ChartData {
    return {
      labels: Object.keys(analytics.statusDistribution),
      datasets: [{
        label: 'Complaints by Status',
        data: Object.values(analytics.statusDistribution),
        backgroundColor: [
          '#fbbf24', // open - amber
          '#60a5fa', // assigned - blue
          '#f97316', // in-progress - orange
          '#10b981'  // resolved - green
        ]
      }]
    };
  }

  getPriorityChartData(analytics: Analytics): ChartData {
    return {
      labels: Object.keys(analytics.priorityDistribution),
      datasets: [{
        label: 'Complaints by Priority',
        data: Object.values(analytics.priorityDistribution),
        backgroundColor: [
          '#10b981', // low - green
          '#f59e0b', // medium - amber
          '#ef4444'  // high - red
        ]
      }]
    };
  }

  getCategoryChartData(analytics: Analytics): ChartData {
    const categories = Object.keys(analytics.categoryDistribution);
    return {
      labels: categories,
      datasets: [{
        label: 'Complaints by Category',
        data: Object.values(analytics.categoryDistribution),
        backgroundColor: this.generateColors(categories.length)
      }]
    };
  }

  getTrendChartData(analytics: Analytics): ChartData {
    return {
      labels: analytics.complaintsTrend.map(t => t.date),
      datasets: [{
        label: 'Complaints Over Time',
        data: analytics.complaintsTrend.map(t => t.count),
        borderColor: '#667eea',
        fill: true,
        backgroundColor: 'rgba(102, 126, 234, 0.1)'
      }]
    };
  }

  getResolutionRateChartData(analytics: Analytics): ChartData {
    const resolved = analytics.resolvedComplaints;
    const pending = analytics.pendingComplaints;

    return {
      labels: ['Resolved', 'Pending'],
      datasets: [{
        label: 'Resolution Status',
        data: [resolved, pending],
        backgroundColor: ['#10b981', '#ef4444']
      }]
    };
  }

  private calculateAvgResolutionTime(resolvedComplaints: Complaint[]): number {
    if (resolvedComplaints.length === 0) return 0;

    const totalTime = resolvedComplaints.reduce((sum, complaint) => {
      if (!complaint.created_at || !complaint.updated_at) return sum;
      const created = new Date(complaint.created_at).getTime();
      const updated = new Date(complaint.updated_at).getTime();
      return sum + (updated - created);
    }, 0);

    const avgMillis = totalTime / resolvedComplaints.length;
    return Math.round((avgMillis / (1000 * 60 * 60 * 24)) * 100) / 100;
  }

  private getDistribution(complaints: Complaint[], keyFunc: (c: Complaint) => string): Record<string, number> {
    return complaints.reduce((acc, complaint) => {
      const key = keyFunc(complaint);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private getComplaintsTrend(complaints: Complaint[], days: number = 30): { date: string; count: number }[] {
    const trendData: Record<string, number> = {};
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trendData[dateStr] = 0;
    }

    complaints.forEach(complaint => {
      if (complaint.created_at) {
        const dateStr = new Date(complaint.created_at).toISOString().split('T')[0];
        if (trendData.hasOwnProperty(dateStr)) {
          trendData[dateStr]++;
        }
      }
    });

    return Object.entries(trendData).map(([date, count]) => ({ date, count }));
  }

  private getStaffPerformance(complaints: Complaint[]): { staffId: number; resolved: number; pending: number }[] {
    const staffMap = new Map<number, { resolved: number; pending: number }>();

    complaints.forEach(complaint => {
      if (complaint.staff_id) {
        if (!staffMap.has(complaint.staff_id)) {
          staffMap.set(complaint.staff_id, { resolved: 0, pending: 0 });
        }
        const stats = staffMap.get(complaint.staff_id)!;
        if (complaint.status === 'resolved') {
          stats.resolved++;
        } else {
          stats.pending++;
        }
      }
    });

    return Array.from(staffMap.entries()).map(([staffId, stats]) => ({
      staffId,
      ...stats
    }));
  }

  private generateColors(count: number): string[] {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe',
      '#43e97b', '#fa709a', '#fee140', '#30b0fe', '#a6278f'
    ];
    return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
  }
}
