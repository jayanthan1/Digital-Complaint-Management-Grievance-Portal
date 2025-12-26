import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ComplaintService } from '../../../core/services/complaint.service';
import { AuthService } from '../../../core/services/auth.service';

const COMPLAINT_CATEGORIES = [
  { value: 'Plumbing', icon: 'plumbing', color: '#3498db', bgColor: 'rgba(52, 152, 219, 0.1)', description: 'Water leaks, pipes, drainage' },
  { value: 'Electrical', icon: 'electrical_services', color: '#f39c12', bgColor: 'rgba(243, 156, 18, 0.1)', description: 'Power, wiring, lighting' },
  { value: 'Facility', icon: 'business', color: '#9b59b6', bgColor: 'rgba(155, 89, 182, 0.1)', description: 'Building, rooms, amenities' },
  { value: 'Maintenance', icon: 'build', color: '#e74c3c', bgColor: 'rgba(231, 76, 60, 0.1)', description: 'Repairs, fixtures, equipment' },
  { value: 'Sanitation', icon: 'cleaning_services', color: '#1abc9c', bgColor: 'rgba(26, 188, 156, 0.1)', description: 'Cleaning, hygiene, waste' },
  { value: 'Security', icon: 'security', color: '#34495e', bgColor: 'rgba(52, 73, 94, 0.1)', description: 'Safety, access, surveillance' },
  { value: 'Other', icon: 'more_horiz', color: '#95a5a6', bgColor: 'rgba(149, 165, 166, 0.1)', description: 'Other issues' }
];

@Component({
  selector: 'app-complaint-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatRippleModule,
    MatTooltipModule
  ],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.4s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="form-container">
      <!-- Animated Background -->
      <div class="bg-decoration">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="gradient-sphere sphere-3"></div>
        <div class="grid-pattern"></div>
      </div>

      <div class="form-wrapper">
        <!-- Left Side - Info Panel -->
        <aside class="info-panel" @fadeIn>
          <div class="info-content">
            <div class="info-header">
              <div class="info-icon">
                <mat-icon>support_agent</mat-icon>
              </div>
              <h2>We're Here to Help</h2>
              <p>Submit your complaint and our team will address it promptly</p>
            </div>

            <div class="process-steps">
              <div class="step" *ngFor="let step of processSteps; let i = index">
                <div class="step-number">{{ i + 1 }}</div>
                <div class="step-content">
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </div>

            <div class="contact-info">
              <h4>Need Immediate Help?</h4>
              <div class="contact-item">
                <mat-icon>phone</mat-icon>
                <span>+1 (555) 123-4567</span>
              </div>
              <div class="contact-item">
                <mat-icon>email</mat-icon>
                <span>support&#64;company.com</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Side - Form -->
        <main class="form-panel" @fadeInUp>
          <div class="form-card">
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-icon" @scaleIn>
                <mat-icon>add_task</mat-icon>
                <div class="icon-ring"></div>
              </div>
              <h1>Register New Complaint</h1>
              <p>Fill in the details below to submit your complaint</p>
            </div>

            <!-- Progress Bar -->
            <div class="progress-bar">
              <div class="progress-fill" [style.width]="getFormProgress() + '%'"></div>
              <span class="progress-text">{{ getFormProgress() }}% Complete</span>
            </div>

            <!-- Form Content -->
            <form [formGroup]="complaintForm" (ngSubmit)="onSubmit()" class="complaint-form">
              
              <!-- Title Field -->
              <div class="form-group" @slideIn>
                <label class="form-label">
                  <mat-icon>title</mat-icon>
                  Complaint Title
                  <span class="required">*</span>
                </label>
                <div class="input-container" 
                     [class.focused]="titleFocused"
                     [class.filled]="complaintForm.get('title')?.value"
                     [class.error]="complaintForm.get('title')?.invalid && complaintForm.get('title')?.touched">
                  <div class="input-icon">
                    <mat-icon>edit</mat-icon>
                  </div>
                  <input 
                    type="text"
                    formControlName="title"
                    placeholder="Brief description of your issue"
                    (focus)="titleFocused = true"
                    (blur)="titleFocused = false"
                  />
                  <div class="input-highlight"></div>
                </div>
                <div class="field-error" *ngIf="complaintForm.get('title')?.hasError('required') && complaintForm.get('title')?.touched">
                  <mat-icon>error</mat-icon>
                  <span>Title is required</span>
                </div>
                <div class="field-hint">
                  <mat-icon>lightbulb</mat-icon>
                  <span>Example: "Broken water pipe in bathroom" or "No electricity in room 204"</span>
                </div>
              </div>

              <!-- Category Selection -->
              <div class="form-group" @slideIn>
                <label class="form-label">
                  <mat-icon>category</mat-icon>
                  Category
                  <span class="required">*</span>
                </label>
                <div class="category-grid">
                  <div 
                    *ngFor="let cat of categories"
                    class="category-card"
                    [class.selected]="complaintForm.get('category')?.value === cat.value"
                    (click)="selectCategory(cat.value)"
                    [style.--cat-color]="cat.color"
                    [style.--cat-bg]="cat.bgColor"
                    matRipple>
                    <div class="category-icon">
                      <mat-icon>{{ cat.icon }}</mat-icon>
                    </div>
                    <div class="category-info">
                      <span class="category-name">{{ cat.value }}</span>
                      <span class="category-desc">{{ cat.description }}</span>
                    </div>
                    <div class="category-check">
                      <mat-icon>check_circle</mat-icon>
                    </div>
                  </div>
                </div>
                <div class="field-error" *ngIf="complaintForm.get('category')?.hasError('required') && complaintForm.get('category')?.touched">
                  <mat-icon>error</mat-icon>
                  <span>Please select a category</span>
                </div>
              </div>

              <!-- Description Field -->
              <div class="form-group" @slideIn>
                <label class="form-label">
                  <mat-icon>description</mat-icon>
                  Detailed Description
                  <span class="required">*</span>
                </label>
                <div class="textarea-container"
                     [class.focused]="descriptionFocused"
                     [class.filled]="complaintForm.get('description')?.value"
                     [class.error]="complaintForm.get('description')?.invalid && complaintForm.get('description')?.touched">
                  <div class="textarea-icon">
                    <mat-icon>notes</mat-icon>
                  </div>
                  <textarea
                    formControlName="description"
                    rows="5"
                    placeholder="Please provide detailed information about your complaint. Include location, time, and any other relevant details..."
                    (focus)="descriptionFocused = true"
                    (blur)="descriptionFocused = false"
                  ></textarea>
                  <div class="textarea-highlight"></div>
                </div>
                <div class="field-footer">
                  <div class="field-error" *ngIf="complaintForm.get('description')?.hasError('required') && complaintForm.get('description')?.touched">
                    <mat-icon>error</mat-icon>
                    <span>Description is required</span>
                  </div>
                  <div class="char-counter" [class.warning]="getDescriptionLength() > 450" [class.limit]="getDescriptionLength() >= 500">
                    {{ getDescriptionLength() }} / 500
                  </div>
                </div>
              </div>

              <!-- Priority Selection (Optional) -->
              <div class="form-group" @slideIn>
                <label class="form-label">
                  <mat-icon>priority_high</mat-icon>
                  Priority Level
                  <span class="optional">(Optional)</span>
                </label>
                <div class="priority-options">
                  <div 
                    *ngFor="let priority of priorities"
                    class="priority-option"
                    [class.selected]="selectedPriority === priority.value"
                    (click)="selectPriority(priority.value)"
                    [style.--priority-color]="priority.color"
                    matRipple>
                    <mat-icon>{{ priority.icon }}</mat-icon>
                    <span>{{ priority.label }}</span>
                  </div>
                </div>
              </div>

              <!-- Attachments Info -->
              <div class="attachment-box" @fadeIn>
                <div class="attachment-icon">
                  <mat-icon>attach_file</mat-icon>
                </div>
                <div class="attachment-content">
                  <h4>Attachments</h4>
                  <p>Photo attachments can be added after submission from the complaint details page</p>
                </div>
              </div>

              <!-- What Happens Next -->
              <div class="info-banner" @fadeIn>
                <div class="banner-icon">
                  <mat-icon>info</mat-icon>
                </div>
                <div class="banner-content">
                  <h4>What happens next?</h4>
                  <div class="banner-steps">
                    <div class="banner-step">
                      <mat-icon>check</mat-icon>
                      <span>Review by team</span>
                    </div>
                    <div class="banner-step">
                      <mat-icon>check</mat-icon>
                      <span>Staff assignment</span>
                    </div>
                    <div class="banner-step">
                      <mat-icon>check</mat-icon>
                      <span>Progress updates</span>
                    </div>
                    <div class="banner-step">
                      <mat-icon>check</mat-icon>
                      <span>Resolution</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="form-actions">
                <button 
                  type="button" 
                  class="btn-cancel"
                  (click)="onCancel()"
                  [disabled]="isLoading"
                  matRipple>
                  <mat-icon>close</mat-icon>
                  Cancel
                </button>

                <button 
                  type="submit" 
                  class="btn-submit"
                  [disabled]="complaintForm.invalid || isLoading"
                  [class.loading]="isLoading"
                  matRipple>
                  <span class="btn-content" *ngIf="!isLoading">
                    <mat-icon>send</mat-icon>
                    Submit Complaint
                  </span>
                  <span class="btn-content" *ngIf="isLoading">
                    <div class="spinner"></div>
                    Submitting...
                  </span>
                </button>
              </div>
            </form>

            <!-- Security Note -->
            <div class="security-note">
              <mat-icon>verified_user</mat-icon>
              <span>Your information is secure and will be handled confidentially</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* ==================== CSS Variables ==================== */
    :host {
      --primary: #667eea;
      --primary-dark: #5a67d8;
      --primary-light: #a3bffa;
      --secondary: #764ba2;
      --accent: #f093fb;
      
      --success: #10b981;
      --success-light: #d1fae5;
      --warning: #f59e0b;
      --warning-light: #fef3c7;
      --danger: #ef4444;
      --danger-light: #fee2e2;
      --info: #3b82f6;
      --info-light: #dbeafe;
      
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-success: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      --gradient-warning: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      --gradient-danger: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      
      --bg-dark: #0f0f1a;
      --bg-primary: #f0f4ff;
      --bg-card: #ffffff;
      --bg-input: #f8fafc;
      
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --text-muted: #94a3b8;
      --text-light: #ffffff;
      
      --border-color: #e2e8f0;
      --border-radius-sm: 8px;
      --border-radius-md: 12px;
      --border-radius-lg: 16px;
      --border-radius-xl: 24px;
      --border-radius-full: 50%;
      
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      --shadow-glow: 0 0 40px rgba(102, 126, 234, 0.2);
    }

    /* ==================== Container ==================== */
    .form-container {
      min-height: 100vh;
      background: var(--bg-dark);
      position: relative;
      overflow: hidden;
    }

    /* ==================== Background Decoration ==================== */
    .bg-decoration {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .gradient-sphere {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
    }

    .sphere-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
      animation: float-slow 20s ease-in-out infinite;
    }

    .sphere-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(118, 75, 162, 0.4) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      animation: float-slow 15s ease-in-out infinite reverse;
    }

    .sphere-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(240, 147, 251, 0.3) 0%, transparent 70%);
      top: 40%;
      right: 30%;
      animation: pulse-glow 8s ease-in-out infinite;
    }

    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-50px) rotate(10deg); }
    }

    @keyframes pulse-glow {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 0.3; }
    }

    /* ==================== Form Wrapper ==================== */
    .form-wrapper {
      display: flex;
      min-height: 100vh;
      position: relative;
      z-index: 1;
    }

    /* ==================== Info Panel ==================== */
    .info-panel {
      width: 400px;
      flex-shrink: 0;
      padding: 60px 40px;
      display: flex;
      align-items: center;
      color: var(--text-light);
    }

    .info-content {
      width: 100%;
    }

    .info-header {
      margin-bottom: 48px;
    }

    .info-icon {
      width: 72px;
      height: 72px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--border-radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .info-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .info-header h2 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #fff 0%, #a3bffa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .info-header p {
      font-size: 1rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      line-height: 1.6;
    }

    .process-steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 48px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .step-number {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .step-content h4 {
      margin: 0 0 4px;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .step-content p {
      margin: 0;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .contact-info {
      padding: 24px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--border-radius-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .contact-info h4 {
      margin: 0 0 16px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .contact-item:last-child {
      margin-bottom: 0;
    }

    .contact-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary-light);
    }

    /* ==================== Form Panel ==================== */
    .form-panel {
      flex: 1;
      padding: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .form-card {
      width: 100%;
      max-width: 700px;
      background: var(--bg-card);
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-2xl), var(--shadow-glow);
      overflow: hidden;
    }

    /* ==================== Card Header ==================== */
    .card-header {
      text-align: center;
      padding: 40px 40px 0;
    }

    .header-icon {
      width: 80px;
      height: 80px;
      background: var(--gradient-primary);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      position: relative;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .header-icon mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: white;
    }

    .icon-ring {
      position: absolute;
      inset: -10px;
      border: 2px dashed rgba(102, 126, 234, 0.3);
      border-radius: var(--border-radius-full);
      animation: spin-slow 25s linear infinite;
    }

    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .card-header h1 {
      margin: 0 0 8px;
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .card-header p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* ==================== Progress Bar ==================== */
    .progress-bar {
      position: relative;
      height: 6px;
      background: var(--border-color);
      margin: 32px 40px 0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    .progress-text {
      position: absolute;
      right: 0;
      top: 12px;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* ==================== Form ==================== */
    .complaint-form {
      padding: 40px;
    }

    .form-group {
      margin-bottom: 32px;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-label mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary);
    }

    .required {
      color: var(--danger);
      margin-left: 2px;
    }

    .optional {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 400;
      margin-left: 8px;
    }

    /* ==================== Input Container ==================== */
    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .input-container:hover {
      border-color: #cbd5e0;
    }

    .input-container.focused {
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .input-container.error {
      border-color: var(--danger);
      background: var(--danger-light);
    }

    .input-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--text-muted);
      flex-shrink: 0;
      transition: color 0.3s ease;
    }

    .input-container.focused .input-icon {
      color: var(--primary);
    }

    .input-container input {
      flex: 1;
      height: 52px;
      border: none;
      background: transparent;
      font-size: 1rem;
      color: var(--text-primary);
      outline: none;
      padding-right: 16px;
    }

    .input-container input::placeholder {
      color: var(--text-muted);
    }

    .input-highlight {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
    }

    .input-container.focused .input-highlight {
      width: 100%;
    }

    /* ==================== Textarea Container ==================== */
    .textarea-container {
      position: relative;
      display: flex;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .textarea-container:hover {
      border-color: #cbd5e0;
    }

    .textarea-container.focused {
      border-color: var(--primary);
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .textarea-container.error {
      border-color: var(--danger);
      background: var(--danger-light);
    }

    .textarea-icon {
      width: 52px;
      padding-top: 16px;
      display: flex;
      justify-content: center;
      color: var(--text-muted);
      flex-shrink: 0;
      transition: color 0.3s ease;
    }

    .textarea-container.focused .textarea-icon {
      color: var(--primary);
    }

    .textarea-container textarea {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 1rem;
      color: var(--text-primary);
      outline: none;
      padding: 16px 16px 16px 0;
      resize: none;
      font-family: inherit;
      line-height: 1.6;
    }

    .textarea-container textarea::placeholder {
      color: var(--text-muted);
    }

    .textarea-highlight {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
    }

    .textarea-container.focused .textarea-highlight {
      width: 100%;
    }

    /* ==================== Field Footer ==================== */
    .field-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .field-error {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--danger);
      font-size: 0.8rem;
      margin-top: 8px;
      animation: shake 0.4s ease;
    }

    .field-error mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .field-hint {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 10px;
      padding: 10px 12px;
      background: var(--info-light);
      border-radius: var(--border-radius-sm);
      font-size: 0.8rem;
      color: var(--info);
    }

    .field-hint mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .char-counter {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }

    .char-counter.warning {
      color: var(--warning);
    }

    .char-counter.limit {
      color: var(--danger);
    }

    /* ==================== Category Grid ==================== */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .category-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-card:hover {
      border-color: var(--cat-color);
      background: var(--cat-bg);
      transform: translateY(-2px);
    }

    .category-card.selected {
      border-color: var(--cat-color);
      background: var(--cat-bg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .category-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--border-radius-sm);
      background: var(--cat-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .category-card.selected .category-icon {
      background: var(--cat-color);
    }

    .category-icon mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
      color: var(--cat-color);
      transition: color 0.3s ease;
    }

    .category-card.selected .category-icon mat-icon {
      color: white;
    }

    .category-info {
      flex: 1;
      min-width: 0;
    }

    .category-name {
      display: block;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .category-desc {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .category-check {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s ease;
    }

    .category-card.selected .category-check {
      opacity: 1;
      transform: scale(1);
    }

    .category-check mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--cat-color);
    }

    /* ==================== Priority Options ==================== */
    .priority-options {
      display: flex;
      gap: 12px;
    }

    .priority-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: var(--bg-input);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .priority-option:hover {
      border-color: var(--priority-color);
      transform: translateY(-2px);
    }

    .priority-option.selected {
      border-color: var(--priority-color);
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .priority-option mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--text-muted);
      transition: color 0.3s ease;
    }

    .priority-option.selected mat-icon {
      color: var(--priority-color);
    }

    .priority-option span {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    .priority-option.selected span {
      color: var(--text-primary);
      font-weight: 600;
    }

    /* ==================== Attachment Box ==================== */
    .attachment-box {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--bg-input);
      border: 2px dashed var(--border-color);
      border-radius: var(--border-radius-md);
      margin-bottom: 24px;
    }

    .attachment-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: var(--shadow-sm);
    }

    .attachment-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: var(--text-muted);
    }

    .attachment-content h4 {
      margin: 0 0 4px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .attachment-content p {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* ==================== Info Banner ==================== */
    .info-banner {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
      border-radius: var(--border-radius-md);
      border-left: 4px solid var(--primary);
      margin-bottom: 32px;
    }

    .banner-icon {
      width: 44px;
      height: 44px;
      background: var(--gradient-primary);
      border-radius: var(--border-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .banner-icon mat-icon {
      color: white;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .banner-content h4 {
      margin: 0 0 12px;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .banner-steps {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .banner-step {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .banner-step mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--success);
    }

    /* ==================== Form Actions ==================== */
    .form-actions {
      display: flex;
      gap: 16px;
    }

    .btn-cancel {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 140px;
      height: 52px;
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-md);
      background: white;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-cancel:hover:not(:disabled) {
      border-color: var(--text-secondary);
      color: var(--text-primary);
    }

    .btn-cancel:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-submit {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 52px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--gradient-primary);
      color: white;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }

    .btn-submit:disabled {
      background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
      box-shadow: none;
      cursor: not-allowed;
    }

    .btn-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ==================== Security Note ==================== */
    .security-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background: var(--bg-input);
      border-top: 1px solid var(--border-color);
    }

    .security-note mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--success);
    }

    .security-note span {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 1200px) {
      .info-panel {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .form-panel {
        padding: 20px;
      }

      .form-card {
        border-radius: var(--border-radius-lg);
      }

      .card-header {
        padding: 32px 24px 0;
      }

      .card-header h1 {
        font-size: 1.5rem;
      }

      .progress-bar {
        margin: 24px 24px 0;
      }

      .complaint-form {
        padding: 32px 24px;
      }

      .category-grid {
        grid-template-columns: 1fr;
      }

      .priority-options {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .btn-cancel {
        width: 100%;
      }

      .banner-steps {
        flex-direction: column;
        gap: 8px;
      }
    }

    @media (max-width: 480px) {
      .form-container {
        padding: 0;
      }

      .form-panel {
        padding: 16px;
      }

      .card-header h1 {
        font-size: 1.25rem;
      }

      .header-icon {
        width: 64px;
        height: 64px;
      }

      .header-icon mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .input-container input,
      .textarea-container textarea {
        font-size: 16px; /* Prevents zoom on iOS */
      }
    }
  `]
})
export class ComplaintFormComponent {
  complaintForm: FormGroup;
  categories = COMPLAINT_CATEGORIES;
  isLoading = false;
  selectedPriority = 'medium';

  // Focus states
  titleFocused = false;
  descriptionFocused = false;

  processSteps = [
    { title: 'Submit Complaint', description: 'Fill out this form with details' },
    { title: 'Review & Assignment', description: 'Our team reviews and assigns staff' },
    { title: 'Resolution', description: 'Issue is addressed and resolved' },
    { title: 'Confirmation', description: 'You receive completion notification' }
  ];

  priorities = [
    { value: 'low', label: 'Low', icon: 'arrow_downward', color: '#10b981' },
    { value: 'medium', label: 'Medium', icon: 'remove', color: '#f59e0b' },
    { value: 'high', label: 'High', icon: 'arrow_upward', color: '#ef4444' }
  ];

  constructor(
    private fb: FormBuilder,
    private complaintService: ComplaintService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.complaintForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
    });
    
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.warn('User is not logged in, redirecting to login');
      this.snackBar.open('❌ Please log in to submit a complaint', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      this.router.navigate(['/auth/login']);
    }
  }

  selectCategory(value: string): void {
    this.complaintForm.patchValue({ category: value });
    this.complaintForm.get('category')?.markAsTouched();
  }

  selectPriority(value: string): void {
    this.selectedPriority = value;
  }

  getFormProgress(): number {
    let progress = 0;
    if (this.complaintForm.get('title')?.valid) progress += 33;
    if (this.complaintForm.get('category')?.valid) progress += 33;
    if (this.complaintForm.get('description')?.valid) progress += 34;
    return progress;
  }

  getDescriptionLength(): number {
    return this.complaintForm.get('description')?.value?.length || 0;
  }

  onSubmit(): void {
    if (this.complaintForm.invalid) return;

    this.isLoading = true;

    // Debug token before sending
    const tokenCheck = localStorage.getItem('token');
    console.log('=== COMPLAINT SUBMISSION ===');
    console.log('Token in localStorage:', tokenCheck ? `EXISTS (length: ${tokenCheck.length})` : 'MISSING');
    console.log('Full token value:', tokenCheck ? tokenCheck.substring(0, 50) + '...' : 'NO TOKEN');

    const formData = {
      title: this.complaintForm.get('title')?.value,
      description: this.complaintForm.get('description')?.value,
      category: this.complaintForm.get('category')?.value
    };

    console.log('Submitting complaint:', formData);

    this.complaintService.createComplaint(formData).subscribe({
      next: (response) => {
        console.log('Complaint submitted successfully:', response);
        this.snackBar.open('✅ Complaint submitted successfully!', 'Close', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/complaints']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Complaint submission error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        
        let errorMessage = 'Failed to submit complaint. Please try again.';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = `Error: ${error.statusText}`;
        }
        
        this.snackBar.open(`❌ ${errorMessage}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      },
      complete: () => this.isLoading = false
    });
  }

  onCancel(): void {
    this.router.navigate(['/complaints']);
  }
}