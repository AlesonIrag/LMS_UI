# 👥 Library Management System - User Roles and Authentication

## 🎯 User Roles Overview

The Library Management System implements a comprehensive role-based access control (RBAC) system with three distinct user types, each with specific permissions and capabilities tailored to their needs within the library ecosystem.

## 🧑‍🎓 Student Users

### Role Description
Students are the primary users of the library system, accessing resources for academic purposes. They have borrowing privileges with standard loan periods and access to personal account management features.

### Authentication Details
- **Identifier**: Student ID (Format: YYYY-NNNNN)
- **Credentials**: Student ID + Password
- **Session Management**: JWT-based authentication with automatic token refresh
- **Password Policy**: Minimum 8 characters with alphanumeric requirements

### Key Permissions
- Browse and search library catalog
- Borrow books (standard loan period: 2 weeks)
- Reserve books when unavailable
- Renew borrowed items (up to 3 times)
- View borrowing history
- Manage personal profile information
- Upload profile photo
- Receive notifications about due dates and reservations

### Dashboard Features
- **Personalized Overview**: Greeting with name and current date
- **Book Search**: Advanced search with filtering options
- **Current Loans**: List of active borrowing transactions
- **Reservation Management**: View and cancel active reservations
- **Borrowing History**: Complete transaction history
- **Fine Tracking**: Outstanding fines and payment history
- **Quick Actions**: Direct access to common functions

### Profile Management
- Update contact information (email, phone)
- Change password
- Upload/replace profile photo
- View account status and borrowing privileges

## 👨‍🏫 Faculty Users

### Role Description
Faculty members have extended privileges compared to students, including longer loan periods, higher renewal limits, and access to specialized academic resources and tools.

### Authentication Details
- **Identifier**: Faculty ID (Auto-generated numeric ID)
- **Credentials**: Faculty ID + Password
- **Session Management**: JWT-based authentication with extended session timeouts
- **Password Policy**: Minimum 8 characters with enhanced security requirements

### Key Permissions
- All student permissions plus:
- Extended loan periods (4 weeks)
- Higher renewal limits (5 times)
- Access to course materials management
- Research database access
- Reading list creation and management
- Priority reservation handling

### Dashboard Features
- **Academic Overview**: Faculty-specific greeting and statistics
- **Extended Book Access**: Special borrowing privileges
- **Course Materials**: Manage academic resources by course
- **Research Tools**: Access to specialized databases
- **Reading Lists**: Create and manage course reading lists
- **Profile Management**: Faculty account settings

### Profile Management
- Update academic information (department, position)
- Manage course associations
- Access research tools and databases
- View extended borrowing history

## 👨‍💼 Admin Users

### Role Description
Administrators manage the entire library system, with different roles having varying levels of access to system functions, from basic librarian tasks to full system administration.

### Authentication Details
- **Identifier**: Email address
- **Credentials**: Email + Password
- **Session Management**: JWT-based authentication with administrative privileges
- **Password Policy**: Enhanced security requirements with regular rotation

### Admin Roles and Permissions

#### 1. Super Admin
- **Full System Access**: Complete control over all system functions
- **User Management**: Create, modify, and delete all user accounts
- **System Configuration**: Modify system-wide settings
- **Database Administration**: Direct database access and management
- **Audit Trail Access**: View all system logs and activities

#### 2. Data Center Admin
- **Data Management**: Oversee data integrity and backups
- **Report Generation**: Create and manage system reports
- **Analytics Access**: View comprehensive system analytics
- **User Data Management**: Manage user information and accounts

#### 3. Librarian
- **Book Management**: Add, edit, and remove books from catalog
- **Transaction Processing**: Manage borrowing and return transactions
- **Reservation Handling**: Process book reservations
- **Fine Management**: Manage overdue fines and payments
- **Student/Faculty Accounts**: Manage user accounts and privileges

#### 4. Librarian Staff
- **Basic Transaction Processing**: Handle borrowing and returns
- **Reservation Assistance**: Help with book reservations
- **User Support**: Assist students and faculty with account issues
- **Daily Operations**: Manage day-to-day library operations

### Dashboard Features
- **System Overview**: Real-time statistics and metrics
- **Books Management**: Complete catalog management interface
- **User Management**: Student, faculty, and admin account management
- **Transaction Tracking**: Monitor all borrowing activities
- **Reservation System**: Manage book reservations
- **Reports Section**: Generate and view system reports
- **Activity Logs**: Audit trail and system monitoring
- **System Settings**: Configuration management
- **Cataloging Tools**: Book categorization and organization

### Profile Management
- Role-specific dashboard access
- System-wide configuration settings
- Audit trail and logging controls
- Report generation and analytics tools

## 🔐 Authentication Flow

### Student Authentication Flow
1. **Login Request**: Student enters Student ID (YYYY-NNNNN) and password
2. **Validation**: Backend validates credentials against Students table
3. **Token Generation**: JWT token created with student claims
4. **Session Storage**: Token stored in localStorage
5. **Dashboard Access**: Redirect to student dashboard
6. **Protected Route Access**: JWT validation on all protected routes
7. **Session Refresh**: Automatic token refresh before expiration

### Faculty Authentication Flow
1. **Login Request**: Faculty enters Faculty ID and password
2. **Validation**: Backend validates credentials against Faculty table
3. **Token Generation**: JWT token created with faculty claims
4. **Session Storage**: Token stored in localStorage
5. **Dashboard Access**: Redirect to faculty dashboard
6. **Protected Route Access**: JWT validation on all protected routes
7. **Session Refresh**: Automatic token refresh with extended timeout

### Admin Authentication Flow
1. **Login Request**: Admin enters email and password
2. **Validation**: Backend validates credentials against Admins table
3. **Role Verification**: Admin role determines access level
4. **Token Generation**: JWT token created with admin role claims
5. **Session Storage**: Token stored in localStorage
6. **Dashboard Access**: Redirect to admin dashboard
7. **Protected Route Access**: JWT validation with role-based permissions
8. **Session Refresh**: Automatic token refresh with administrative timeout

## 🔑 Security Implementation

### Password Security
- **Hashing Algorithm**: bcryptjs with configurable rounds
- **Salt Generation**: Automatic unique salt per password
- **Strength Requirements**: Minimum length and complexity rules
- **Rotation Policy**: Regular password change recommendations

### Token Management
- **JWT Signing**: Asymmetric key signing for enhanced security
- **Expiration**: Configurable token lifetimes per role
- **Refresh Tokens**: Automatic session extension
- **Blacklisting**: Token invalidation on logout

### Session Security
- **Timeout Handling**: Automatic logout after inactivity
- **Concurrent Sessions**: Role-based session limits
- **Device Tracking**: Session monitoring across devices
- **Suspicious Activity**: Automated detection and response

### Data Protection
- **Encryption at Rest**: Database encryption for sensitive data
- **Encryption in Transit**: HTTPS/TLS for all communications
- **Input Sanitization**: XSS and injection attack prevention
- **Access Logging**: Comprehensive audit trail of all actions

## 🔄 Password Recovery System

### Student Password Recovery
1. **Request Initiation**: Student clicks "Forgot Password" on login page
2. **Identity Verification**: Enter Student ID for validation
3. **Token Generation**: Secure reset token created and stored
4. **Notification**: Email sent with reset link (if email provided)
5. **Reset Process**: User accesses reset link with token
6. **Validation**: Token verification and expiration check
7. **Password Update**: New password hashing and storage
8. **Confirmation**: Success notification and login redirect

### Faculty Password Recovery
1. **Request Initiation**: Faculty clicks "Forgot Password" on login page
2. **Identity Verification**: Enter Faculty ID for validation
3. **Token Generation**: Secure reset token created and stored
4. **Notification**: Email sent with reset link
5. **Reset Process**: User accesses reset link with token
6. **Validation**: Token verification and expiration check
7. **Password Update**: New password hashing and storage
8. **Confirmation**: Success notification and login redirect

### Admin Password Recovery
1. **Request Initiation**: Admin clicks "Forgot Password" on login page
2. **Identity Verification**: Enter email for validation
3. **Security Questions**: Additional verification steps
4. **Token Generation**: Secure reset token created and stored
5. **Notification**: Email sent with reset link
6. **Reset Process**: User accesses reset link with token
7. **Validation**: Token verification and expiration check
8. **Password Update**: New password hashing and storage
9. **Audit Logging**: Recovery action logged for security

## 📱 Multi-Device Support

### Session Management Across Devices
- **Simultaneous Sessions**: Role-dependent concurrent session limits
- **Device Recognition**: Browser and device fingerprinting
- **Session Sync**: Real-time updates across devices
- **Remote Termination**: Ability to end sessions from other devices

### Mobile Authentication
- **Responsive Login**: Optimized for mobile screens
- **Touch-Friendly**: Large input targets and controls
- **Biometric Support**: Future integration potential
- **Offline Considerations**: Graceful degradation when offline

## 🛡️ Account Security Features

### Brute Force Protection
- **Rate Limiting**: Failed login attempt throttling
- **Lockout Mechanism**: Temporary account suspension
- **Notification System**: Admin alerts for suspicious activity
- **IP Tracking**: Monitoring of login attempt sources

### Account Status Management
- **Active Status**: Full system access
- **Suspended Status**: Temporary access restriction
- **Disabled Status**: Permanent access removal
- **Graduated Status**: Special handling for graduated students

### Privacy Controls
- **Data Minimization**: Collection of only necessary information
- **Consent Management**: Clear privacy policy and consent tracking
- **Data Portability**: Ability to export personal data
- **Right to Erasure**: Account deletion and data removal

This comprehensive documentation outlines the user roles and authentication system of the Library Management System, providing a clear understanding of how different users interact with the system and how their access is secured and managed.