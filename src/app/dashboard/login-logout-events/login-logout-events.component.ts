import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

interface LoginLogoutEvent {
  id: number;
  adminId: number;
  adminName: string;
  adminRole: string;
  action: string;
  timestamp: Date;
}

interface LoginLogoutStats {
  totalEvents: number;
  logins: number;
  logouts: number;
  thisWeek: number;
}

@Component({
  selector: 'app-login-logout-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-logout-events.component.html',
  styleUrls: ['./login-logout-events.component.css']  
})
export class LoginLogoutEventsComponent implements OnInit {
  stats: LoginLogoutStats = {
    totalEvents: 0,
    logins: 0,
    logouts: 0,
    thisWeek: 0
  };

  loginLogoutEvents: LoginLogoutEvent[] = [];
  filteredEvents: LoginLogoutEvent[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private themeService: ThemeService,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  ngOnInit(): void {
    this.loadLoginLogoutEvents();
  }

  private loadLoginLogoutEvents(): void {
    const currentAdmin = this.authService.getCurrentAdmin();
    if (!currentAdmin) {
      this.error = 'No admin user found';
      this.loading = false;
      return;
    }

    // Fetch admin audit logs from the backend
    this.apiService.getAdminAuditLogs(undefined, 100, 0).subscribe({
      next: (response) => {
        if (response && response.success && response.data) {
          // Filter for login/logout events this week
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          
          this.loginLogoutEvents = response.data
            .filter(log => 
              (log.Action.includes('login') || log.Action.includes('logout')) &&
              new Date(log.Timestamp) >= oneWeekAgo
            )
            .map(log => ({
              id: log.LogID,
              adminId: log.AdminID,
              adminName: log.FullName,
              adminRole: log.AdminRole,
              action: log.Action,
              timestamp: new Date(log.Timestamp)
            }))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by newest first

          this.filteredEvents = [...this.loginLogoutEvents];
          this.calculateStats();
        } else {
          this.error = 'Failed to load login/logout events';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading login/logout events:', error);
        this.error = 'Failed to load login/logout events: ' + (error.error || 'Unknown error');
        this.loading = false;
      }
    });
  }

  private calculateStats(): void {
    this.stats.totalEvents = this.filteredEvents.length;
    this.stats.logins = this.filteredEvents.filter(event => event.action.includes('login')).length;
    this.stats.logouts = this.filteredEvents.filter(event => event.action.includes('logout')).length;
    this.stats.thisWeek = this.filteredEvents.length;
  }

  // Theme-related methods
  getTextClasses(): string {
    return this.isDarkMode ? 'text-white' : 'text-gray-900';
  }

  getSecondaryTextClasses(): string {
    return this.isDarkMode ? 'text-gray-400' : 'text-gray-600';
  }

  getCardClasses(): string {
    return this.isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-900';
  }

  getActionClass(action: string): string {
    if (action.includes('login')) {
      return this.isDarkMode 
        ? 'bg-green-900 text-green-200 border-green-700' 
        : 'bg-green-100 text-green-800 border-green-200';
    } else if (action.includes('logout')) {
      return this.isDarkMode 
        ? 'bg-red-900 text-red-200 border-red-700' 
        : 'bg-red-100 text-red-800 border-red-200';
    }
    return this.isDarkMode 
      ? 'bg-gray-700 text-gray-200 border-gray-600' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }

  getTimestampClass(): string {
    return this.isDarkMode ? 'text-blue-400' : 'text-blue-600';
  }

  refreshData(): void {
    this.loading = true;
    this.error = null;
    this.loadLoginLogoutEvents();
  }
}