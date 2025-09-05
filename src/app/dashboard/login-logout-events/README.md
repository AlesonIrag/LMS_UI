# Login/Logout Events Component

## Overview
This component displays a log of admin login and logout events for the current week. It provides administrators with visibility into system access patterns and security monitoring.

## Features
- Displays login/logout events from the past 7 days
- Shows statistics for total events, logins, and logouts
- Provides visual indicators for different event types (login/logout)
- Responsive design that works on all device sizes
- Dark mode support
- Refresh functionality to update data

## Data Source
The component fetches data from the `adminauditlogs` table in the database through the backend API. It specifically looks for records with actions containing "login" or "logout" in the action description.

## Usage
The component is accessible through the dashboard navigation under the "Reports & Analytics" section, specifically the "Login/Logout Events" menu item.

## Technical Details
- Component path: `src/app/dashboard/login-logout-events/`
- Route: `/dashboard/login-logout-events`
- Dependencies: 
  - `ApiService` for backend communication
  - `AuthService` for authentication context
  - `ThemeService` for dark mode support

## API Endpoints Used
- `GET /api/v1/adminauth/admin-audit-logs` - Fetches admin audit logs

## Data Structure
The component expects data in the following format:
```typescript
interface LoginLogoutEvent {
  id: number;
  adminId: number;
  adminName: string;
  adminRole: string;
  action: string;
  timestamp: Date;
}
```

## Future Enhancements
- Add filtering by date range
- Add filtering by specific admin user
- Add export functionality for audit reports
- Add pagination for large datasets
- Add search functionality