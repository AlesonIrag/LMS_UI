# Library Management System - AI - System Index

## Project Overview
This is a full-stack Library Management System built with Angular (frontend) and Node.js/Express (backend). The system includes features for managing books, students, faculty, administrators, borrowing, and more. It was designed for Benedicto College with professional UI/UX and separated deployment capabilities.

## Project Structure

### Root Directory
- `src/` - Frontend Angular application
- `backend-api/` - Backend Node.js/Express API
- Configuration files (angular.json, package.json, tsconfig.json, etc.)
- Deployment scripts and guides

### Frontend (Angular)
Location: `src/app/`

Main Components:
- Landing page (`/`)
- Login systems (Student, Admin, Faculty)
- Dashboards (Admin, Student, Faculty)
- Book management
- User management (Students, Faculty, Admins)
- Borrowing/reservation systems
- Profile management
- Support pages (Privacy Policy, Terms of Service, etc.)

Routing:
- Main routes defined in `src/app/app.routes.ts`
- Guarded routes for different user types (AdminGuard, StudentGuard, FacultyGuard)

### Backend (Node.js/Express)
Location: `backend-api/`

Main API Endpoints:
- `/api/v1/auth` - Student authentication and management
- `/api/v1/adminauth` - Administrator authentication and management
- `/api/v1/facultyauth` - Faculty authentication and management
- `/api/v1/books` - Book management
- `/api/v1/borrowing` - Borrowing and reservation system
- `/api/v1/weather` - Weather information for Cebu City
- `/api/v1/uploads` - File upload handling
- `/api/v1/password-reset` - Password reset functionality
- `/api/v1/posts` - Posts management
- `/api/v1/reactions` - Reaction system

Key Features:
- JWT-based authentication
- Rate limiting for security
- CORS configuration for cross-origin requests
- Database integration (MariaDB/MySQL)
- File upload capabilities
- Security middleware (helmet, compression)
- Logging system
- Audit trails for admin and faculty actions

### Key Dependencies

Frontend:
- Angular 20.x
- TailwindCSS for styling
- RxJS for reactive programming
- Axios for HTTP requests

Backend:
- Express.js 5.x
- MariaDB/MySQL database driver
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email functionality
- Multer for file uploads
- Joi for validation
- Helmet for security headers

### Development Scripts

Frontend:
- `npm start` - Start development server
- `npm run start:separated` - Start frontend in separated deployment mode
- `npm run build` - Build for production
- `npm run build:separated` - Build for separated deployment
- `npm test` - Run unit tests

Backend:
- `npm run backend:start` - Start backend server
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:install` - Install backend dependencies

Full Development Environment:
- `npm run dev:full` - Start both frontend and backend concurrently
- `npm run dev:separated` - Start both in separated mode

## Database Schema

### Core Tables

#### Books
- `BookID` (Primary Key)
- `Title` - Book title
- `Author` - Author name
- `ISBN` - International Standard Book Number
- `Category` - Book category
- `Subject` - Subject area
- `PublishedYear` - Publication year
- `CopyrightYear` - Copyright year
- `Publisher` - Publisher name
- `CallNumber` - Library call number
- `DeweyDecimal` - Dewey Decimal classification
- `Copies` - Number of copies
- `Remarks` - Additional notes
- `Status` - Available/Borrowed/Lost/Damaged
- `ShelfLocation` - Physical location in library
- `AcquisitionDate` - Date acquired
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Record update timestamp

#### Students
- `StudentID` (Primary Key) - Format: YYYY-NNNNN
- `FirstName` - First name
- `MiddleInitial` - Middle initial
- `LastName` - Last name
- `Suffix` - Name suffix (Jr., Sr., etc.)
- `Course` - Academic course
- `YearLevel` - Year level (1-4)
- `Section` - Class section
- `Email` - Email address
- `PhoneNumber` - Contact number
- `ProfilePhoto` - URL to profile photo
- `Password` - Hashed password
- `EnrollmentStatus` - Active/Inactive
- `AccountStatus` - Allowed/Blocked
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Record update timestamp

#### Faculty
- `FacultyID` (Primary Key) - Format: YYYY-NNNNN
- `FirstName` - First name
- `MiddleInitial` - Middle initial
- `LastName` - Last name
- `Suffix` - Name suffix (Jr., Sr., etc.)
- `Department` - Academic department
- `Position` - Position title
- `Email` - Email address
- `PhoneNumber` - Contact number
- `ProfilePhoto` - URL to profile photo
- `Password` - Hashed password
- `Status` - Active/Inactive
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Record update timestamp

#### Admins
- `AdminID` (Primary Key)
- `FirstName` - First name
- `MiddleInitial` - Middle initial
- `LastName` - Last name
- `Suffix` - Name suffix (Jr., Sr., etc.)
- `FullName` - Computed full name
- `Email` - Email address
- `Password` - Hashed password
- `Role` - Super Admin/Admin/Librarian/Librarian Staff
- `Status` - Active/Inactive
- `ProfilePhoto` - URL to profile photo
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Record update timestamp

#### Transactions (Borrowing)
- `TransactionID` (Primary Key)
- `StudentID` - Reference to student (nullable)
- `FacultyID` - Reference to faculty (nullable)
- `BookID` - Reference to book
- `BorrowDate` - Date borrowed
- `DueDate` - Due date for return
- `ReturnDate` - Actual return date
- `Status` - Pending/Borrowed/Returned/Overdue
- `RenewalCount` - Number of renewals
- `CreatedAt` - Record creation timestamp
- `UpdatedAt` - Record update timestamp

#### Reservations
- `ReservationID` (Primary Key)
- `BookID` - Reference to book
- `StudentID` - Reference to student (nullable)
- `FacultyID` - Reference to faculty (nullable)
- `ReservedAt` - Reservation timestamp
- `Status` - Pending/Approved/Declined/Expired

#### Audit Logs
- Admin Audit Logs - Track admin actions
- Faculty Audit Logs - Track faculty actions

## API Endpoints

### Authentication Routes

#### Student Authentication (`/api/v1/auth`)
- `POST /register-student` - Register a new student
- `POST /login` - Student login
- `POST /validate-session` - Validate student session
- `POST /logout` - Student logout
- `GET /get-student/:studentID` - Get student by ID
- `GET /get-all-students` - Get all students
- `PUT /update-student/:studentID` - Update student information
- `DELETE /delete-student/:studentID` - Delete student
- `POST /change-password` - Change student password

#### Admin Authentication (`/api/v1/adminauth`)
- `POST /register-admin` - Register a new admin
- `POST /login-admin` - Admin login
- `POST /validate-session` - Validate admin session
- `POST /logout` - Admin logout
- `GET /get-admin/:adminID` - Get admin by ID
- `GET /get-all-admins` - Get all admins (with pagination)
- `GET /get-admins-by-role/:role` - Get admins by role
- `PUT /update-admin/:adminID` - Update admin information
- `DELETE /delete-admin/:adminID` - Delete admin
- `GET /admin-audit-logs` - Get admin audit logs
- `GET /admin-audit-logs/:adminID` - Get audit logs for specific admin
- `POST /change-admin-password/:adminID` - Change admin password
- `GET /profile/:adminId` - Get admin profile
- `PUT /profile/:adminId` - Update admin profile

#### Faculty Authentication (`/api/v1/facultyauth`)
- `POST /register-faculty` - Register a new faculty member
- `POST /login-faculty` - Faculty login
- `POST /validate-session` - Validate faculty session
- `POST /logout` - Faculty logout
- `GET /get-faculty/:facultyID` - Get faculty by ID
- `GET /get-all-faculty` - Get all faculty members
- `GET /get-faculty-by-department/:department` - Get faculty by department
- `GET /get-faculty-by-position/:position` - Get faculty by position
- `PUT /update-faculty/:facultyID` - Update faculty information
- `DELETE /delete-faculty/:facultyID` - Delete faculty member
- `GET /faculty-audit-logs` - Get faculty audit logs
- `GET /faculty-audit-logs/:facultyID` - Get audit logs for specific faculty
- `POST /change-faculty-password/:facultyID` - Change faculty password

### Book Management (`/api/v1/books`)
- `GET /test` - Test endpoint
- `GET /get-all-books` - Get all books (with pagination)
- `PUT /update-book/:bookId` - Update book information
- `DELETE /delete-book/:bookId` - Delete book
- `POST /add-book` - Add a new book

### Borrowing System (`/api/v1/borrowing`)
- `POST /create-reservation` - Create a new reservation
- `GET /reservations` - Get all reservations
- `POST /fulfill-reservation/:reservationId` - Fulfill a reservation
- `POST /reject-reservation/:reservationId` - Reject a reservation
- `POST /notify-reservation/:reservationId` - Send notification about reservation
- `GET /borrowing-transactions` - Get all borrowing transactions
- `POST /return-book/:transactionId` - Return a borrowed book
- `POST /create-fine` - Create a fine for overdue books
- `POST /renew-book/:transactionId` - Renew a borrowed book
- `GET /check-overdue` - Check for overdue books
- `PUT /mark-fine-paid/:fineId` - Mark a fine as paid
- `GET /student-stats/:studentId` - Get student-specific library statistics
- `GET /student-transactions/:studentId` - Get student's borrowing transactions
- `GET /student-reservations/:studentId` - Get student's reservations
- `GET /student-fines/:studentId` - Get student's fines

### Weather (`/api/v1/weather`)
- `GET /` - Get current weather for Cebu City
- `GET /forecast` - Get 5-day weather forecast

## Deployment
The system includes deployment configurations for:
- Cloudflare
- Render
- Nginx
- Docker (separate files for frontend and backend)

## Additional Documentation
Multiple markdown files provide detailed guides for:
- Deployment procedures
- Environment setup
- JWT implementation
- Logging system
- Heart reactions implementation

## Quick Start

### Option 1: Run Everything Together (Recommended for Development)
```bash
# Windows
start-dev.bat

# Or manually
npm run dev:full
```

### Option 2: Run Separated (Simulates Production Deployment)
```bash
# Windows
start-separated.bat

# Or manually
npm run dev:separated
```

### Option 3: Manual Setup
```bash
# Install all dependencies
npm run setup

# Terminal 1: Start Backend
npm run backend:start

# Terminal 2: Start Frontend
npm start
```