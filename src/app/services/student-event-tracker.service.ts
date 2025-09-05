import { Injectable } from '@angular/core';

export interface StudentEvent {
  id: string;
  studentId: string;
  studentName: string;
  action: 'login' | 'logout';
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentEventTrackerService {
  private readonly STORAGE_KEY = 'student_login_events';
  private readonly MAX_EVENTS = 1000; // Limit to prevent storage overflow

  constructor() { }

  /**
   * Track a student login event
   */
  trackLogin(studentId: string, studentName: string, ipAddress?: string): void {
    this.addEvent({
      id: this.generateId(),
      studentId,
      studentName,
      action: 'login',
      timestamp: new Date(),
      ipAddress,
      userAgent: navigator.userAgent
    });
  }

  /**
   * Track a student logout event
   */
  trackLogout(studentId: string, studentName: string, ipAddress?: string): void {
    this.addEvent({
      id: this.generateId(),
      studentId,
      studentName,
      action: 'logout',
      timestamp: new Date(),
      ipAddress,
      userAgent: navigator.userAgent
    });
  }

  /**
   * Get all events for a specific student within the last week
   */
  getStudentEventsThisWeek(studentId: string): StudentEvent[] {
    const events = this.getAllEvents();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return events
      .filter((event: StudentEvent) => 
        event.studentId === studentId && 
        new Date(event.timestamp) >= oneWeekAgo
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get login/logout statistics for a student within the last week
   */
  getStudentStatsThisWeek(studentId: string): { logins: number; logouts: number; uniqueDays: number } {
    const events = this.getStudentEventsThisWeek(studentId);
    const logins = events.filter((event: StudentEvent) => event.action === 'login').length;
    const logouts = events.filter((event: StudentEvent) => event.action === 'logout').length;
    
    // Count unique days
    const uniqueDays = new Set(
      events.map((event: StudentEvent) => new Date(event.timestamp).toDateString())
    ).size;
    
    return { logins, logouts, uniqueDays };
  }

  /**
   * Get all events within the last week (for admin view)
   */
  getAllEventsThisWeek(): StudentEvent[] {
    const events = this.getAllEvents();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return events
      .filter((event: StudentEvent) => new Date(event.timestamp) >= oneWeekAgo)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get events within a specific date range
   */
  getEventsByDateRange(startDate: Date, endDate: Date): StudentEvent[] {
    const events = this.getAllEvents();
    
    return events
      .filter((event: StudentEvent) => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= startDate && eventDate <= endDate;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get statistics for a specific date range
   */
  getStatsByDateRange(startDate: Date, endDate: Date): { totalEvents: number; logins: number; logouts: number; uniqueStudents: number } {
    const events = this.getEventsByDateRange(startDate, endDate);
    const logins = events.filter((event: StudentEvent) => event.action === 'login').length;
    const logouts = events.filter((event: StudentEvent) => event.action === 'logout').length;
    const uniqueStudents = new Set(events.map((event: StudentEvent) => event.studentId)).size;
    
    return {
      totalEvents: events.length,
      logins,
      logouts,
      uniqueStudents
    };
  }

  /**
   * Get statistics for all students within the last week
   */
  getAllStatsThisWeek(): { totalEvents: number; logins: number; logouts: number; uniqueStudents: number } {
    const events = this.getAllEventsThisWeek();
    const logins = events.filter((event: StudentEvent) => event.action === 'login').length;
    const logouts = events.filter((event: StudentEvent) => event.action === 'logout').length;
    const uniqueStudents = new Set(events.map((event: StudentEvent) => event.studentId)).size;
    
    return {
      totalEvents: events.length,
      logins,
      logouts,
      uniqueStudents
    };
  }

  /**
   * Clean up old events (older than 30 days)
   */
  cleanupOldEvents(): void {
    try {
      const events = this.getAllEvents();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentEvents = events.filter((event: StudentEvent) => new Date(event.timestamp) >= thirtyDaysAgo);
      
      // Only save if we actually removed events
      if (recentEvents.length < events.length) {
        this.saveEvents(recentEvents);
        console.log(`🧹 Cleaned up ${events.length - recentEvents.length} old events. ${recentEvents.length} events remaining.`);
      }
    } catch (error) {
      console.error('Error cleaning up old events:', error);
    }
  }

  /**
   * Periodically clean up old events (should be called periodically)
   */
  periodicCleanup(): void {
    // Run cleanup every 24 hours
    setInterval(() => {
      this.cleanupOldEvents();
    }, 24 * 60 * 60 * 1000); // 24 hours
  }

  /**
   * Clear all events
   */
  clearAllEvents(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export events as JSON string
   */
  exportEvents(): string {
    const events = this.getAllEvents();
    return JSON.stringify(events, null, 2);
  }

  /**
   * Import events from JSON string
   */
  importEvents(jsonData: string): void {
    try {
      const events = JSON.parse(jsonData);
      // Validate events structure
      if (Array.isArray(events)) {
        // Convert timestamp strings back to Date objects and validate
        const validEvents = events.map(event => {
          if (typeof event.timestamp === 'string') {
            event.timestamp = new Date(event.timestamp);
          }
          return event;
        }).filter(event => 
          event.id && 
          event.studentId && 
          event.studentName && 
          event.action && 
          event.timestamp instanceof Date && 
          !isNaN(event.timestamp.getTime())
        );
        
        this.saveEvents(validEvents);
        console.log(`📥 Imported ${validEvents.length} events`);
      }
    } catch (error) {
      console.error('Error importing events:', error);
      throw new Error('Invalid JSON data');
    }
  }

  /**
   * Private methods
   */
  private addEvent(event: StudentEvent): void {
    try {
      const events = this.getAllEvents();
      
      // Add new event at the beginning
      events.unshift(event);
      
      // Limit to MAX_EVENTS
      if (events.length > this.MAX_EVENTS) {
        events.splice(this.MAX_EVENTS);
      }
      
      this.saveEvents(events);
    } catch (error) {
      console.error('Error tracking student event:', error);
    }
  }

  private getAllEvents(): StudentEvent[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const events = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        return events.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error retrieving student events:', error);
      return [];
    }
  }

  private saveEvents(events: StudentEvent[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving student events:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}