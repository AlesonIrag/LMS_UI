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
export class StudentEventService {
  private readonly STORAGE_KEY = 'student_login_events';
  private readonly MAX_EVENTS = 1000; // Limit to prevent storage overflow

  constructor() { }

  /**
   * Record a student login/logout event
   */
  recordEvent(studentId: string, studentName: string, action: 'login' | 'logout'): void {
    try {
      const event: StudentEvent = {
        id: this.generateEventId(),
        studentId,
        studentName,
        action,
        timestamp: new Date(),
        ipAddress: this.getClientIpAddress(),
        userAgent: navigator.userAgent
      };

      this.saveEvent(event);
      console.log('✅ Student event recorded:', event);
    } catch (error) {
      console.error('❌ Error recording student event:', error);
    }
  }

  /**
   * Get all events for a specific student within the last week
   */
  getWeeklyEvents(studentId: string): StudentEvent[] {
    try {
      const allEvents = this.getAllEvents();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      return allEvents
        .filter(event => 
          event.studentId === studentId && 
          new Date(event.timestamp) >= oneWeekAgo
        )
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('❌ Error retrieving student events:', error);
      return [];
    }
  }

  /**
   * Get login/logout statistics for a student within the last week
   */
  getWeeklyStats(studentId: string): { total: number; logins: number; logouts: number } {
    try {
      const events = this.getWeeklyEvents(studentId);
      const logins = events.filter(event => event.action === 'login').length;
      const logouts = events.filter(event => event.action === 'logout').length;

      return {
        total: events.length,
        logins,
        logouts
      };
    } catch (error) {
      console.error('❌ Error calculating student event stats:', error);
      return { total: 0, logins: 0, logouts: 0 };
    }
  }

  /**
   * Get all events from local storage
   */
  private getAllEvents(): StudentEvent[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const events = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return events.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }));
    } catch (error) {
      console.error('❌ Error parsing stored events:', error);
      return [];
    }
  }

  /**
   * Save an event to local storage
   */
  private saveEvent(event: StudentEvent): void {
    try {
      const allEvents = this.getAllEvents();
      
      // Add new event at the beginning
      allEvents.unshift(event);
      
      // Limit to MAX_EVENTS to prevent storage overflow
      if (allEvents.length > this.MAX_EVENTS) {
        allEvents.splice(this.MAX_EVENTS);
      }
      
      // Clean up old events (older than 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentEvents = allEvents.filter(event => 
        new Date(event.timestamp) >= thirtyDaysAgo
      );
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentEvents));
    } catch (error) {
      console.error('❌ Error saving event to localStorage:', error);
    }
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get client IP address (simplified implementation)
   */
  private getClientIpAddress(): string | undefined {
    // In a real implementation, you would get this from the server
    // For now, we'll return undefined and let the backend handle IP tracking
    return undefined;
  }

  /**
   * Clear all events (useful for testing or reset)
   */
  clearAllEvents(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ All student events cleared from localStorage');
    } catch (error) {
      console.error('❌ Error clearing student events:', error);
    }
  }
}