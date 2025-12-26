import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-authorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule],
  template: `
    <div class="not-authorized-container">
      <mat-card class="error-card">
        <mat-card-header>
          <mat-card-title>Access Denied</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <p>You do not have permission to access this page.</p>
          <p>Please contact an administrator if you believe this is an error.</p>
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/complaints">
            Go to Complaints
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .not-authorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 70vh;
    }

    .error-card {
      width: 100%;
      max-width: 400px;
      text-align: center;
    }

    .error-card p {
      margin: 10px 0;
      color: #666;
    }
  `]
})
export class NotAuthorizedComponent { }
