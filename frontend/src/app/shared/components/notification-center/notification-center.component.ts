import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of (notifications$ | async) as notif; let i = index" 
        class="notification-item"
        [@notificationAnimation]="'in'"
        [ngClass]="'notification-' + notification.type">
        
        <div class="notification-icon">
          <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
        </div>

        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
          <div *ngIf="notification.action" class="notification-action">
            <button 
              mat-button 
              (click)="handleAction(notification)"
              class="action-button">
              {{ notification.action.label }}
            </button>
          </div>
        </div>

        <button 
          mat-icon-button 
          (click)="close(notification.id)"
          class="close-button"
          matTooltip="Dismiss">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: auto;
    }

    .notification-item {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid #667eea;
      align-items: flex-start;
      animation: slideIn 0.3s ease-out;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &.notification-success {
        border-left-color: #10b981;
        background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);

        .notification-icon {
          color: #10b981;
        }
      }

      &.notification-error {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);

        .notification-icon {
          color: #ef4444;
        }
      }

      &.notification-warning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);

        .notification-icon {
          color: #f59e0b;
        }
      }

      &.notification-info {
        border-left-color: #3b82f6;
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);

        .notification-icon {
          color: #3b82f6;
        }
      }

      &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transform: translateX(-4px);
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-title {
      font-size: 14px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 4px;
    }

    .notification-message {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .notification-action {
      margin-top: 8px;
    }

    .action-button {
      height: auto;
      min-height: auto;
      padding: 4px 12px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #667eea;
      font-weight: 600;

      &:hover {
        background-color: rgba(102, 126, 234, 0.1);
      }
    }

    .close-button {
      flex-shrink: 0;
      margin-right: -8px;
      margin-top: -8px;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    @media (max-width: 640px) {
      .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
      }

      .notification-item {
        padding: 12px;
        border-radius: 6px;
      }

      .notification-title {
        font-size: 13px;
      }

      .notification-message {
        font-size: 12px;
      }
    }
  `],
  animations: [
    trigger('notificationAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(400px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(400px)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationCenterComponent implements OnInit {
  notifications$ = this.notificationService.getAll$();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Component initializes with notification stream from service
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }

  close(id: string): void {
    this.notificationService.remove(id);
  }

  handleAction(notification: Notification): void {
    if (notification.action?.callback) {
      notification.action.callback();
    }
    this.close(notification.id);
  }
}
