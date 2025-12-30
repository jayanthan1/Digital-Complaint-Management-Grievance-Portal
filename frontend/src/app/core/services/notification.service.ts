import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    callback: () => void;
  };
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification[]>();
  public notifications$ = this.notificationSubject.asObservable();

  private notificationQueue: Notification[] = [];
  private maxNotifications = 5;

  showSuccess(title: string, message: string, duration = 4000): void {
    this.show({ title, message, type: 'success', duration });
  }

  showError(title: string, message: string, duration = 5000): void {
    this.show({ title, message, type: 'error', duration });
  }

  showWarning(title: string, message: string, duration = 4000): void {
    this.show({ title, message, type: 'warning', duration });
  }

  showInfo(title: string, message: string, duration = 3000): void {
    this.show({ title, message, type: 'info', duration });
  }

  show(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };

    this.notificationQueue.push(newNotification);

    if (this.notificationQueue.length > this.maxNotifications) {
      this.notificationQueue.shift();
    }

    this.notificationSubject.next([...this.notificationQueue]);

    if (notification.duration) {
      setTimeout(() => {
        this.remove(newNotification.id);
      }, notification.duration);
    }
  }

  remove(id: string): void {
    this.notificationQueue = this.notificationQueue.filter(n => n.id !== id);
    this.notificationSubject.next([...this.notificationQueue]);
  }

  getAll(): Notification[] {
    return [...this.notificationQueue];
  }

  getAll$(): Observable<Notification[]> {
    return this.notifications$;
  }
}
