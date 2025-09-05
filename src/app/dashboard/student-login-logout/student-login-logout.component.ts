import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ApiService, StudentLoginEvent, StudentLoginStats } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { StudentEventTrackerService } from '../../services/student-event-tracker.service';

interface WeeklyLoginCount {
  count: number;
}

@Component({
  selector: 'app-student-login-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-login-logout.component.html',
  styleUrls: ['./student-login-logout.component.css']
})
export class StudentLoginLogoutComponent implements OnInit {
  stats: StudentLoginStats = {
    totalEvents: 0,
    logins: 0,
    logouts: 0,
    uniqueStudents: 0
  };

  weeklyLoginCount: WeeklyLoginCount = { count: 0 };
  
  loginLogoutEvents: StudentLoginEvent[] = [];
  filteredEvents: StudentLoginEvent[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private themeService: ThemeService,
    private apiService: ApiService,
    private authService: AuthService,
    private studentEventTracker: StudentEventTrackerService
  ) { }

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  ngOnInit(): void {
    this.loadStudentLoginLogoutEvents();
    this.loadStudentLoginStats();
    this.loadWeeklyLoginCount();
  }

  private loadStudentLoginLogoutEvents(): void {
    const currentAdmin = this.authService.getCurrentAdmin();
    if (!currentAdmin) {
      this.error = 'No admin user found';
      this.loading = false;
      return;
    }

    // Calculate date range for the current week
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch student login/logout events from the backend
    this.apiService.getStudentLoginEvents(100, 0, startDateStr, endDateStr).subscribe({
      next: (response) => {
        let backendEvents: StudentLoginEvent[] = [];
        if (response && response.success && response.data) {
          backendEvents = response.data;
          console.log('✅ Loaded student login/logout events from backend:', backendEvents);
        } else {
          console.warn('⚠️ No backend events found or error loading events');
        }

        // Also get events from local storage
        const localStorageEvents = this.studentEventTracker.getAllEventsThisWeek();
        
        // Convert localStorage events to match the API format
        const convertedLocalStorageEvents: StudentLoginEvent[] = localStorageEvents.map(event => ({
          id: parseInt(event.id.replace(/\D/g, '')) || Date.now(), // Extract number from ID or use timestamp
          studentId: event.studentId,
          studentName: event.studentName,
          action: event.action,
          ipAddress: event.ipAddress || 'Local',
          deviceInfo: event.userAgent || navigator.userAgent,
          timestamp: event.timestamp.toISOString()
        }));

        // Combine both sources (backend and local storage)
        // For demo purposes, we'll show both, but in a real app you might want to merge or prioritize
        this.loginLogoutEvents = [...backendEvents, ...convertedLocalStorageEvents];
        this.filteredEvents = [...this.loginLogoutEvents];
        
        console.log('✅ Combined student login/logout events (backend + localStorage):', this.loginLogoutEvents);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading student login/logout events:', error);
        // Don't set error to null, just continue with local storage events
        this.loading = false;
        
        // Even if backend fails, try to show local storage events
        try {
          const localStorageEvents = this.studentEventTracker.getAllEventsThisWeek();
          this.loginLogoutEvents = localStorageEvents.map(event => ({
            id: parseInt(event.id.replace(/\D/g, '')) || Date.now(),
            studentId: event.studentId,
            studentName: event.studentName,
            action: event.action,
            ipAddress: event.ipAddress || 'Local',
            deviceInfo: event.userAgent || navigator.userAgent,
            timestamp: event.timestamp.toISOString()
          }));
          this.filteredEvents = [...this.loginLogoutEvents];
        } catch (localError) {
          console.error('❌ Error loading local storage events:', localError);
        }
      }
    });
  }

  private loadStudentLoginStats(): void {
    const currentAdmin = this.authService.getCurrentAdmin();
    if (!currentAdmin) {
      return;
    }

    // Calculate date range for the current week
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch student login statistics from the backend
    this.apiService.getStudentLoginStats(startDateStr, endDateStr).subscribe({
      next: (response) => {
        let backendStats: StudentLoginStats = {
          totalEvents: 0,
          logins: 0,
          logouts: 0,
          uniqueStudents: 0
        };
        
        if (response && response.success && response.data) {
          backendStats = response.data;
          console.log('✅ Loaded student login stats from backend:', backendStats);
        }

        // Also get stats from local storage
        const localStorageStats = this.studentEventTracker.getAllStatsThisWeek();
        
        // Combine stats from both sources
        this.stats = {
          totalEvents: backendStats.totalEvents + localStorageStats.totalEvents,
          logins: backendStats.logins + localStorageStats.logins,
          logouts: backendStats.logouts + localStorageStats.logouts,
          uniqueStudents: backendStats.uniqueStudents + localStorageStats.uniqueStudents
        };
        
        console.log('✅ Combined student login stats (backend + localStorage):', this.stats);
      },
      error: (error) => {
        console.error('❌ Error loading student login stats:', error);
        
        // Even if backend fails, show local storage stats
        try {
          const localStorageStats = this.studentEventTracker.getAllStatsThisWeek();
          this.stats = {
            totalEvents: localStorageStats.totalEvents,
            logins: localStorageStats.logins,
            logouts: localStorageStats.logouts,
            uniqueStudents: localStorageStats.uniqueStudents
          };
          console.log('⚠️ Showing local storage stats only:', this.stats);
        } catch (localError) {
          console.error('❌ Error loading local storage stats:', localError);
        }
      }
    });
  }

  private loadWeeklyLoginCount(): void {
    // For now, we'll use the uniqueStudents count from stats as our weekly login count
    // In a real application, you might want to calculate this differently
    this.weeklyLoginCount = { count: this.stats.uniqueStudents };
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
    if (action.toLowerCase().includes('login')) {
      return this.isDarkMode 
        ? 'bg-green-900 text-green-200 border-green-700' 
        : 'bg-green-100 text-green-800 border-green-200';
    } else if (action.toLowerCase().includes('logout')) {
      return this.isDarkMode 
        ? 'bg-red-900 text-red-200 border-red-700' 
        : 'bg-red-100 text-red-800 border-red-200';
    }
    return this.isDarkMode 
      ? 'bg-gray-700 text-gray-200 border-gray-600' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getTimeAgo(timestamp: string): string {
    const eventTime = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));

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
    // Don't reset error to null to keep any existing messages
    this.loadStudentLoginLogoutEvents();
    this.loadStudentLoginStats();
    this.loadWeeklyLoginCount();
  }
}