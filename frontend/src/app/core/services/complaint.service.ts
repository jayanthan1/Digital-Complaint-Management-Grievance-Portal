import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Complaint, ApiResponse, ComplaintStats, CategoryStat } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:5000/api/complaints';

  constructor(private http: HttpClient) { }

  createComplaint(complaint: { title: string; description: string; category: string }): Observable<ApiResponse<Complaint>> {
    // Debug: Log token availability at service level
    const tokenForDebug = localStorage.getItem('token');
    console.log('📌 [ComplaintService.createComplaint] Called');
    console.log('📌 [ComplaintService.createComplaint] Token in localStorage:', tokenForDebug ? `EXISTS (${tokenForDebug.length} chars)` : 'MISSING');
    console.log('📌 [ComplaintService.createComplaint] Sending POST to:', `${this.apiUrl}`);
    
    return this.http.post<ApiResponse<Complaint>>(`${this.apiUrl}`, complaint);
  }

  getMyComplaints(): Observable<ApiResponse<Complaint[]>> {
    return this.http.get<ApiResponse<Complaint[]>>(`${this.apiUrl}/my-complaints`);
  }

  getStaffAssignedComplaints(): Observable<ApiResponse<Complaint[]>> {
    return this.http.get<ApiResponse<Complaint[]>>(`${this.apiUrl}/staff-assigned`);
  }

  getUnassignedComplaints(): Observable<ApiResponse<Complaint[]>> {
    return this.http.get<ApiResponse<Complaint[]>>(`${this.apiUrl}/unassigned/available`);
  }

  getComplaintById(id: number): Observable<ApiResponse<Complaint>> {
    return this.http.get<ApiResponse<Complaint>>(`${this.apiUrl}/${id}`);
  }

  updateComplaintStatus(id: number, status: string): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.apiUrl}/${id}/status`, { status });
  }

  assignToStaff(id: number, staff_id: number): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.apiUrl}/${id}/assign`, { staff_id });
  }

  getAllComplaints(): Observable<ApiResponse<Complaint[]>> {
    return this.http.get<ApiResponse<Complaint[]>>(`${this.apiUrl}`);
  }

  getStatistics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/statistics/overview`);
  }
}
