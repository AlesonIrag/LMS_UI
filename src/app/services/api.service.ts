import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, timer, of } from 'rxjs';
import { catchError, retry, timeout, map, delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;
  private readonly backendUrl = environment.backendUrl;
  private connectionStatus$ = new BehaviorSubject<ConnectionStatus>({
    isConnected: false,
    lastChecked: new Date(),
    retryCount: 0
  });

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) {
    this.initializeConnectionMonitoring();
  }

  // Connection status observable
  getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionStatus$.asObservable();
  }

  // Health check endpoint
  checkHealth(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.backendUrl}${environment.endpoints.health}`, {
      headers: this.defaultHeaders
    }).pipe(
      timeout(environment.connectionRetry?.timeout || 5000),
      map((response: any) => {
        this.updateConnectionStatus(true, 0);
        return response;
      }),
      catchError(error => {
        this.updateConnectionStatus(false, this.connectionStatus$.value.retryCount + 1);
        return this.handleError(error);
      })
    );
  }

  // Generic GET request
  get<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get(url, {
      headers: this.defaultHeaders,
      ...options
    }).pipe(
      map((response: any) => response as ApiResponse<T>),
      timeout(environment.connectionRetry?.timeout || 10000),
      retry(environment.connectionRetry?.maxRetries || 2),
      catchError(this.handleError)
    );
  }

  // Generic POST request
  post<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post(url, data, {
      headers: this.defaultHeaders,
      ...options
    }).pipe(
      map((response: any) => response as ApiResponse<T>),
      timeout(environment.connectionRetry?.timeout || 10000),
      retry(environment.connectionRetry?.maxRetries || 2),
      catchError(this.handleError)
    );
  }

  // Generic PUT request
  put<T>(endpoint: string, data: any, options?: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put(url, data, {
      headers: this.defaultHeaders,
      ...options
    }).pipe(
      map((response: any) => response as ApiResponse<T>),
      timeout(environment.connectionRetry?.timeout || 10000),
      retry(environment.connectionRetry?.maxRetries || 2),
      catchError(this.handleError)
    );
  }

  // Generic DELETE request
  delete<T>(endpoint: string, options?: any): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete(url, {
      headers: this.defaultHeaders,
      ...options
    }).pipe(
      map((response: any) => response as ApiResponse<T>),
      timeout(environment.connectionRetry?.timeout || 10000),
      retry(environment.connectionRetry?.maxRetries || 2),
      catchError(this.handleError)
    );
  }

  // Authentication endpoints
  login(credentials: { studentId: string; password: string }): Observable<ApiResponse> {
    return this.post(environment.endpoints.auth + '/login', credentials);
  }

  // Student session validation
  validateStudentSession(token: string): Observable<ApiResponse> {
    return this.post(environment.endpoints.auth + '/validate-session', { token });
  }

  // Faculty session validation
  validateFacultySession(token: string): Observable<ApiResponse> {
    return this.post(environment.endpoints.facultyAuth + '/validate-session', { token });
  }

  // Admin session validation
  validateAdminSession(token: string): Observable<ApiResponse> {
    return this.post(environment.endpoints.adminAuth + '/validate-session', { token });
  }

  // Admin authentication endpoints
  adminLogin(credentials: { email: string; password: string }): Observable<ApiResponse> {
    return this.post(environment.endpoints.adminAuth + '/login-admin', credentials);
  }

  facultyLogin(credentials: { facultyId: string; password: string }): Observable<ApiResponse> {
    console.log('🔐 API Service: Faculty login request for:', credentials.facultyId);

    // Temporary mock response for testing (remove when backend is working)
    if (credentials.facultyId === '2022-000001' && credentials.password === 'FacultyPass123') {
      console.log('✅ Mock faculty login successful');
      return of({
        success: true,
        data: {
          FacultyID: 2022000001,
          FullName: 'Dr. John Smith',
          Department: 'Computer Science',
          Position: 'Professor',
          Email: 'john.smith@benedictocollege.edu.ph',
          PhoneNumber: '09123456789',
          Status: 'Active',
          Specialization: 'Database Systems',
          FormattedFacultyID: '2022-000001'
        },
        message: 'Faculty login successful'
      } as ApiResponse).pipe(delay(1000)); // Simulate network delay
    }

    // Try real backend first, fallback to mock on error
    return this.post(environment.endpoints.facultyAuth + '/login-faculty', credentials).pipe(
      catchError(error => {
        console.warn('⚠️ Backend not available, using mock response for invalid credentials');
        console.error('Backend error:', error);

        // Return mock error for invalid credentials
        return of({
          success: false,
          message: 'Invalid faculty credentials',
          data: null
        } as ApiResponse).pipe(delay(1000));
      })
    );
  }

  // Admin profile and session management
  getAdminProfile(adminId: number): Observable<ApiResponse> {
    return this.get(`${environment.endpoints.adminAuth}/get-admin/${adminId}`);
  }



  // Weather endpoints
  getWeather(): Observable<ApiResponse> {
    return this.get(environment.endpoints.weather);
  }

  getWeatherForecast(): Observable<ApiResponse> {
    return this.get(environment.endpoints.weather + '/forecast');
  }

  // Private methods
  private initializeConnectionMonitoring(): void {
    // Check connection every 30 seconds
    timer(0, 30000).subscribe(() => {
      this.checkHealth().subscribe();
    });
  }

  private updateConnectionStatus(isConnected: boolean, retryCount: number): void {
    this.connectionStatus$.next({
      isConnected,
      lastChecked: new Date(),
      retryCount
    });
  }

  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Backend server is not reachable. Please ensure the backend is running.';
          break;
        case 400:
          errorMessage = 'Bad Request: ' + (error.error?.message || 'Invalid request data');
          break;
        case 401:
          errorMessage = 'Unauthorized: ' + (error.error?.message || 'Authentication required');
          break;
        case 403:
          errorMessage = 'Forbidden: ' + (error.error?.message || 'Access denied');
          break;
        case 404:
          errorMessage = 'Not Found: ' + (error.error?.message || 'Resource not found');
          break;
        case 500:
          errorMessage = 'Internal Server Error: ' + (error.error?.message || 'Server error');
          break;
        default:
          errorMessage = `Server Error (${error.status}): ${error.error?.message || error.message}`;
      }
    }

    if (environment.enableLogging) {
      console.error('API Error:', {
        status: error.status,
        message: errorMessage,
        url: error.url,
        timestamp: new Date().toISOString()
      });
    }

    return throwError(() => ({
      success: false,
      error: errorMessage,
      status: error.status
    }));
  };
}
