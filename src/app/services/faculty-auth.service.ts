import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';

interface Faculty {
  facultyId: string;
  fullName: string;
  department: string;
  position: string;
  email: string;
  phoneNumber?: string;
  status: string;
  specialization?: string;
  formattedFacultyId?: string; // The formatted ID like "2000-00001"
}

@Injectable({
  providedIn: 'root'
})
export class FacultyAuthService {
  private currentFacultySubject = new BehaviorSubject<Faculty | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentFaculty$ = this.currentFacultySubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Initialize as not authenticated by default
    this.isAuthenticatedSubject.next(false);
    this.currentFacultySubject.next(null);

    // Then check for stored authentication
    this.checkStoredAuth();
  }

  /**
   * Check if there's stored authentication data
   */
  private checkStoredAuth(): void {
    const storedFaculty = localStorage.getItem('currentFaculty');
    const storedToken = localStorage.getItem('facultyToken');
    const loginTimestamp = localStorage.getItem('facultyLoginTimestamp');

    if (storedFaculty && storedToken && loginTimestamp) {
      try {
        const faculty = JSON.parse(storedFaculty);
        const timestamp = parseInt(loginTimestamp);
        const now = Date.now();
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        // Check if session is still valid (within 24 hours)
        if (now - timestamp < sessionDuration) {
          this.currentFacultySubject.next(faculty);
          this.isAuthenticatedSubject.next(true);
          console.log('🔄 Restored faculty authentication from localStorage:', faculty.fullName);
        } else {
          console.log('🕐 Faculty session expired, clearing stored auth');
          this.clearStoredAuth();
        }
      } catch (error) {
        console.error('Error parsing stored faculty data:', error);
        this.clearStoredAuth();
      }
    } else {
      // Clear any incomplete stored data
      this.clearStoredAuth();
    }
  }

  /**
   * Force refresh authentication state from localStorage
   */
  refreshAuthState(): void {
    console.log('🔄 Forcing faculty authentication state refresh...');
    this.checkStoredAuth();
  }

  /**
   * Faculty login method
   */
  facultyLogin(facultyId: string, password: string): Observable<boolean> {
    console.log('🚀 Starting faculty login for:', facultyId);
    console.log('🔍 Current auth state before login:', this.isAuthenticated());
    console.log('👤 Current faculty before login:', this.getCurrentFaculty());

    // Validate input
    if (!facultyId || !password) {
      console.error('❌ Faculty login failed - missing credentials');
      return of(false);
    }

    return this.apiService.facultyLogin({ facultyId, password }).pipe(
      tap((response: any) => {
        console.log('🔍 Raw API Response:', response);
      }),
      map((response: any) => {
        console.log('🔍 Processing API Response:', response);

        if (response && response.success && response.data) {
          const faculty: Faculty = {
            facultyId: response.data.FacultyID.toString(),
            fullName: response.data.FullName,
            department: response.data.Department,
            position: response.data.Position,
            email: response.data.Email,
            phoneNumber: response.data.PhoneNumber,
            status: response.data.Status,
            specialization: response.data.Specialization,
            formattedFacultyId: response.data.FormattedFacultyID || facultyId
          };

          console.log('✅ Faculty data processed:', faculty);

          // Store in localStorage first (this is synchronous)
          localStorage.setItem('currentFaculty', JSON.stringify(faculty));
          // Store the actual JWT token from the backend response
          if (response.token) {
            localStorage.setItem('facultyToken', response.token);
            console.log('🔑 Faculty JWT token stored:', response.token.substring(0, 20) + '...');
          } else {
            console.warn('⚠️ No token received from backend, using fallback');
            localStorage.setItem('facultyToken', 'faculty-token-' + Date.now());
          }
          localStorage.setItem('facultyLoginTimestamp', Date.now().toString());

          // Then update the subjects (this triggers observables)
          this.currentFacultySubject.next(faculty);
          this.isAuthenticatedSubject.next(true);

          console.log('✅ Faculty login successful, authentication state updated');
          console.log('🔐 Current auth state:', this.isAuthenticated());
          console.log('👤 Current faculty:', this.getCurrentFaculty());
          console.log('💾 LocalStorage faculty:', localStorage.getItem('currentFaculty'));
          console.log('💾 LocalStorage token:', localStorage.getItem('facultyToken'));

          return true;
        } else {
          console.error('❌ Faculty login failed - invalid response structure');
          console.error('Response:', response);
          return false;
        }
      }),
      catchError((error) => {
        console.error('❌ Faculty login error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        return of(false);
      })
    );
  }

  /**
   * Get current faculty
   */
  getCurrentFaculty(): Faculty | null {
    return this.currentFacultySubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('facultyToken');
  }

  /**
   * Logout method
   */
  logout(): void {
    console.log('🚪 Faculty logging out...');
    this.clearStoredAuth();
    this.currentFacultySubject.next(null);
    this.isAuthenticatedSubject.next(false);
    console.log('✅ Faculty logout complete');
  }

  /**
   * Clear stored authentication data
   */
  private clearStoredAuth(): void {
    localStorage.removeItem('currentFaculty');
    localStorage.removeItem('facultyToken');
    localStorage.removeItem('facultyLoginTimestamp');
  }

  /**
   * Validate faculty session with backend JWT verification
   */
  validateSession(): Observable<boolean> {
    const faculty = this.getCurrentFaculty();
    const token = this.getToken();

    if (!faculty || !token) {
      console.log('❌ Faculty session validation failed: Missing required data');
      this.logout();
      return of(false);
    }

    // Validate with backend
    return this.apiService.post('/facultyauth/validate-session', { token }).pipe(
      map((response: any) => {
        if (response && response.success) {
          console.log('✅ Faculty session validation successful');
          return true;
        } else {
          console.log('❌ Faculty session validation failed');
          this.logout();
          return false;
        }
      }),
      catchError((error) => {
        console.error('❌ Faculty session validation error:', error);
        this.logout();
        return of(false);
      })
    );
  }

  /**
   * Update faculty profile
   */
  updateProfile(updates: Partial<Faculty>): Observable<boolean> {
    const currentFaculty = this.getCurrentFaculty();
    if (!currentFaculty) {
      return of(false);
    }

    const updatedFaculty = { ...currentFaculty, ...updates };
    
    // Update localStorage
    localStorage.setItem('currentFaculty', JSON.stringify(updatedFaculty));
    
    // Update subject
    this.currentFacultySubject.next(updatedFaculty);
    
    console.log('✅ Faculty profile updated:', updatedFaculty);
    return of(true);
  }

  /**
   * Check if faculty has specific permissions
   */
  hasPermission(permission: string): boolean {
    const faculty = this.getCurrentFaculty();
    if (!faculty) return false;

    // Faculty have extended permissions
    const facultyPermissions = [
      'view_books',
      'borrow_books',
      'view_loans',
      'renew_books',
      'make_reservations',
      'view_profile',
      'update_profile',
      'manage_course_materials',
      'view_student_records',
      'create_reading_lists',
      'access_research_tools',
      'manage_class_resources'
    ];

    return facultyPermissions.includes(permission);
  }

  /**
   * Get faculty dashboard stats
   */
  getDashboardStats(): Observable<any> {
    // Mock data - replace with actual API call
    return of({
      totalBooksLoaned: 8,
      overdueBooks: 0,
      availableRenewals: 12,
      libraryFines: 0,
      reservations: 3,
      courseMaterials: 25,
      activeClasses: 4,
      researchProjects: 2
    });
  }
}
