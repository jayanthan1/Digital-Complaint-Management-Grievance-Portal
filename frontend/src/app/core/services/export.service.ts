import { Injectable } from '@angular/core';
import { Complaint } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Export complaints to CSV format
   */
  exportToCSV(complaints: Complaint[], filename: string = 'complaints.csv'): void {
    const headers = ['ID', 'Title', 'Description', 'Category', 'Status', 'Priority', 'Created Date', 'Updated Date', 'User ID', 'Staff ID'];
    
    const rows = complaints.map(complaint => [
      complaint.id,
      this.escapeCSV(complaint.title),
      this.escapeCSV(complaint.description),
      complaint.category,
      complaint.status,
      complaint.priority || 'N/A',
      this.formatDate(complaint.created_at),
      this.formatDate(complaint.updated_at),
      complaint.user_id,
      complaint.staff_id || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    this.downloadFile(csvContent, filename, 'text/csv');
  }

  /**
   * Export complaints to JSON format
   */
  exportToJSON(complaints: Complaint[], filename: string = 'complaints.json'): void {
    const json = JSON.stringify(complaints, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  /**
   * Export complaints summary to text format
   */
  exportToText(complaints: Complaint[], filename: string = 'complaints-summary.txt'): void {
    let text = 'COMPLAINT MANAGEMENT SYSTEM - EXPORT SUMMARY\n';
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Total Complaints: ${complaints.length}\n`;
    text += '='.repeat(80) + '\n\n';

    complaints.forEach((complaint, index) => {
      text += `COMPLAINT #${index + 1}\n`;
      text += `-`.repeat(80) + '\n';
      text += `ID: ${complaint.id}\n`;
      text += `Title: ${complaint.title}\n`;
      text += `Description: ${complaint.description}\n`;
      text += `Category: ${complaint.category}\n`;
      text += `Status: ${complaint.status}\n`;
      text += `Priority: ${complaint.priority || 'N/A'}\n`;
      text += `Created: ${this.formatDate(complaint.created_at)}\n`;
      text += `Updated: ${this.formatDate(complaint.updated_at)}\n`;
      text += `User ID: ${complaint.user_id}\n`;
      text += `Staff ID: ${complaint.staff_id || 'N/A'}\n`;
      text += '\n';
    });

    text += '='.repeat(80) + '\n';
    text += `END OF REPORT\n`;

    this.downloadFile(text, filename, 'text/plain');
  }

  /**
   * Generate statistics report
   */
  generateStatisticsReport(complaints: Complaint[]): string {
    const totalComplaints = complaints.length;
    const statusCounts = this.groupBy(complaints, c => c.status);
    const priorityCounts = this.groupBy(complaints, c => c.priority || 'medium');
    const categoryCounts = this.groupBy(complaints, c => c.category);
    const avgResolutionTime = this.calculateAverageResolutionTime(complaints);

    let report = 'COMPLAINT STATISTICS REPORT\n';
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += '='.repeat(80) + '\n\n';

    report += `TOTAL COMPLAINTS: ${totalComplaints}\n\n`;

    report += 'STATUS BREAKDOWN:\n';
    Object.entries(statusCounts).forEach(([status, count]) => {
      const percentage = ((count as number) / totalComplaints * 100).toFixed(2);
      report += `  ${status}: ${count} (${percentage}%)\n`;
    });

    report += '\nPRIORITY BREAKDOWN:\n';
    Object.entries(priorityCounts).forEach(([priority, count]) => {
      const percentage = ((count as number) / totalComplaints * 100).toFixed(2);
      report += `  ${priority}: ${count} (${percentage}%)\n`;
    });

    report += '\nCATEGORY BREAKDOWN:\n';
    Object.entries(categoryCounts).forEach(([category, count]) => {
      const percentage = ((count as number) / totalComplaints * 100).toFixed(2);
      report += `  ${category}: ${count} (${percentage}%)\n`;
    });

    if (avgResolutionTime) {
      report += `\nAVERAGE RESOLUTION TIME: ${avgResolutionTime} days\n`;
    }

    return report;
  }

  /**
   * Download file helper
   */
  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Escape CSV special characters
   */
  private escapeCSV(value: string): string {
    if (!value) return '';
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  /**
   * Format date to readable string
   */
  private formatDate(date?: Date | string): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString();
  }

  /**
   * Group array by key function
   */
  private groupBy(array: Complaint[], keyFunc: (item: Complaint) => any): Record<string, number> {
    return array.reduce((acc, item) => {
      const key = keyFunc(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Calculate average resolution time
   */
  private calculateAverageResolutionTime(complaints: Complaint[]): number | null {
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved' && c.created_at && c.updated_at);
    
    if (resolvedComplaints.length === 0) return null;

    const totalTime = resolvedComplaints.reduce((sum, complaint) => {
      const created = new Date(complaint.created_at!);
      const updated = new Date(complaint.updated_at!);
      const diff = updated.getTime() - created.getTime();
      return sum + diff;
    }, 0);

    const avgMillis = totalTime / resolvedComplaints.length;
    const avgDays = avgMillis / (1000 * 60 * 60 * 24);
    return Math.round(avgDays * 100) / 100;
  }
}
