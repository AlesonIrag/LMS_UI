# Student Login/Logout Events Component

## Overview
This component displays a log of student login and logout events for the current week. It provides administrators with visibility into student system access patterns and security monitoring.

## Features
- Displays student login/logout events from the past 7 days
- Shows statistics for total events, logins, logouts, and unique students
- Provides visual indicators for different event types (login/logout)
- Responsive design that works on all device sizes
- Dark mode support
- Refresh functionality to update data

## Data Source
The component fetches data from the `systemlogs` table in the database through the backend API. It specifically looks for records with `UserType = 'Student'` and `ActionType IN ('Login', 'Logout')`.

## Usage
The component is accessible through the dashboard navigation under the "User Management" section, specifically the "Student Login Events" menu item.

## Technical Details
- Component path: `src/app/dashboard/student-login-logout/`
- Route: `/dashboard/student-login-logout`
- Backend API endpoint: `/api/v1/student-login-events`
- Dependencies: 
  - `ApiService` for backend communication
  - `AuthService` for authentication context
  - `ThemeService` for dark mode support

## API Endpoints Used
- `GET /api/v1/student-login-events` - Fetches student login/logout events
- `GET /api/v1/student-login-events/stats` - Fetches student login/logout statistics

## Data Structure
The component expects data in the following format:
```typescript
interface StudentLoginEvent {
  id: number;
  studentId: string;
  studentName: string;
  action: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
}

interface StudentLoginStats {
  totalEvents: number;
  logins: number;
  logouts: number;
  uniqueStudents: number;
}
```

## Backend Implementation
The backend implementation is located at `backend-api/routes/studentLoginEvents.js` and includes:
1. A route to fetch student login/logout events with filtering by date range
2. A route to fetch statistics for student login/logout events
3. Proper error handling and data formatting

## Future Enhancements
- Add filtering by date range
- Add filtering by specific student
- Add export functionality for audit reports
- Add pagination for large datasets
- Add search functionality