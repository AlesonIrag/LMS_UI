# Library Management System - AI - Complete System Documentation

## Project Overview
This is a full-stack Library Management System built with Angular (frontend) and Node.js/Express (backend). The system includes features for managing books, students, faculty, administrators, borrowing, and more. It was designed for Benedicto College with professional UI/UX and separated deployment capabilities.

## Architecture

### System Components
1. **Frontend**: Angular 20.x application with responsive UI
2. **Backend**: Node.js/Express API server
3. **Database**: MariaDB/MySQL
4. **Authentication**: JWT-based authentication system
5. **Deployment**: Docker, Render, Cloudflare configurations

### Deployment Architecture Options

#### Same Server Deployment
```
┌─────────────────┐    HTTP    ┌─────────────────┐    Database    ┌─────────────────┐
│   Frontend      │ ─────────► │   Backend       │ ─────────────► │   MariaDB       │
│   (Angular)     │            │   (Node.js)     │                │   (MySQL)       │
│   Port: 4200    │            │   Port: 3000    │                │   Port: 3306    │
└─────────────────┘            └─────────────────┘                └─────────────────┘
```

#### Separated Deployment
```
┌─────────────────┐              ┌─────────────────┐    Database    ┌─────────────────┐
│   Frontend      │              │   Backend       │ ─────────────► │   MariaDB       │
│   (Angular)     │ ────────────►│   (Node.js)     │                │   (MySQL)       │
│   Port: 4200    │    HTTPS     │   Port: 3000    │                │   Port: 3306    │
└─────────────────┘              └─────────────────┘                └─────────────────┘
```

## Project Structure

### Root Directory
```
Library-Management-System-AI/
├── src/                    # Frontend Angular application
├── backend-api/            # Backend Node.js/Express API
├── angular.json            # Angular configuration
├── package.json            # Frontend dependencies
├── README.md               # Project documentation
├── SYSTEM_INDEX.md         # System index (this file)
├── DEPLOYMENT_GUIDE.md     # Deployment instructions
├── DATABASE_SETUP.md       # Database setup guide
├── ENVIRONMENT_SETUP.md    # Environment configuration
└── ...                     # Other configuration files
```

### Frontend Structure (src/)
```
src/
├── app/
│   ├── about/              # About page
│   ├── admin-login/        # Admin login
│   ├── components/         # Reusable UI components
│   ├── contact/            # Contact page
│   ├── dashboard/          # Admin dashboard
│   ├── directives/         # Custom directives
│   ├── faculty-dashboard/  # Faculty dashboard
│   ├── faculty-login/      # Faculty login
│   ├── faculty-profile/    # Faculty profile
│   ├── forgot-password/    # Password reset
│   ├── guards/             # Route guards
│   ├── interfaces/         # TypeScript interfaces
│   ├── landing/            # Landing page
│   ├── login/              # Student login
│   ├── not-found/          # 404 page
│   ├── privacy-policy/     # Privacy policy
│   ├── services/           # API services
│   ├── shared/             # Shared modules
│   ├── student-dashboard/  # Student dashboard
│   ├── student-profile/    # Student profile
│   ├── support/            # Support pages
│   ├── terms-of-service/   # Terms of service
│   ├── test/               # Test components
│   ├── app.component.ts    # Main app component
│   ├── app.routes.ts       # Routing configuration
│   └── ...
├── environments/           # Environment configurations
├── assets/                 # Static assets
├── index.html              # Main HTML file
├── main.ts                 # Application entry point
└── styles.css              # Global styles
```

### Backend Structure (backend-api/)
```
backend-api/
├── config/                 # Database and configuration
├── middleware/             # Security and validation middleware
├── routes/                 # API route handlers
├── services/               # Business logic services
├── utils/                  # Utility functions
├── uploads/                # File uploads directory
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
├── docs/                   # API documentation
├── server.js               # Main server file
├── db.js                   # Database configuration
├── .env.example            # Environment example
├── package.json            # Backend dependencies
└── ...
```

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

## Environment Configuration

### Development Environment
File: `src/environments/environment.ts`
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  backendUrl: 'http://localhost:3000',
  enableLogging: true,
  enableDebugMode: true
};
```

### Production Environment
File: `src/environments/environment.prod.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://benedictocollege-library.org:3000/api/v1',
  backendUrl: 'https://benedictocollege-library.org:3000',
  enableLogging: false,
  enableDebugMode: false
};
```

### Backend Environment Variables
File: `backend-api/.env`
```
# Database Configuration
DB_HOST=localhost
DB_USER=lms_user
DB_PASS=lms2026
DB_NAME=dblibrary

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000

# API Keys
OPENWEATHER_API_KEY=your-api-key-here

# Security Settings
JWT_SECRET=your-jwt-secret-key-here
SESSION_SECRET=your-session-secret-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OTP Configuration
OTP_EXPIRY_MINUTES=10
RESET_TOKEN_EXPIRY_HOURS=1
```

## Database Setup

1. Create database and user:
```sql
CREATE DATABASE IF NOT EXISTS dblibrary;
CREATE USER IF NOT EXISTS 'lms_user'@'localhost' IDENTIFIED BY 'lms2026';
GRANT ALL PRIVILEGES ON dblibrary.* TO 'lms_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Import database schema from `backend-api/lms2026.sql` or run the creation scripts in `backend-api/create-tables.sql`

## Development Setup

### Prerequisites
- Node.js 18+
- MySQL/MariaDB
- Angular CLI

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend-api
npm install
cd ..

# Or use the setup script
npm run setup
```

### Running the Application

#### Option 1: Run Everything Together (Recommended for Development)
```bash
# Windows
start-dev.bat

# Or manually
npm run dev:full
```

#### Option 2: Run Separated (Simulates Production Deployment)
```bash
# Windows
start-separated.bat

# Or manually
npm run dev:separated
```

#### Option 3: Manual Setup
```bash
# Terminal 1: Start Backend
npm run backend:start

# Terminal 2: Start Frontend
npm start
```

## Deployment Options

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Frontend: http://localhost:4200
# Backend: http://localhost:3000
```

### Render Deployment
1. Create two services on Render:
   - Web service for backend (Node.js)
   - Static site for frontend (Angular)

2. Set environment variables in Render dashboard

3. Configure custom domains and SSL

### Cloudflare Deployment
1. Build frontend for production:
   ```bash
   npm run build:prod
   ```

2. Deploy to Cloudflare Pages

3. Configure backend API proxy

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **Rate Limiting**: Prevent abuse with request limits
3. **CORS Protection**: Controlled cross-origin requests
4. **Input Validation**: Joi validation for all inputs
5. **Password Hashing**: Bcrypt for secure password storage
6. **Helmet.js**: Security headers for Express
7. **Compression**: Gzip compression for responses
8. **Audit Logs**: Track all admin and faculty actions

## Testing

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/

# Test student registration
curl -X POST http://localhost:3000/api/v1/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{"studentID":"2022-00001","firstName":"John","lastName":"Doe","email":"john@example.com","password":"securePassword123"}'
```

### Frontend Testing
```bash
# Run Angular unit tests
npm test

# Run end-to-end tests
ng e2e
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check database credentials in `.env` file
   - Ensure MySQL/MariaDB service is running
   - Verify database and user exist

2. **CORS Issues**:
   - Update `ALLOWED_ORIGINS` in `.env` file
   - Check browser console for CORS errors

3. **Authentication Failures**:
   - Verify JWT secret key in `.env` file
   - Check password hashing implementation

4. **Port Conflicts**:
   - Change PORT in `.env` file
   - Kill processes using the ports

### Useful Commands

```bash
# Check running processes
netstat -ano | findstr :3000
netstat -ano | findstr :4200

# Kill processes by PID
taskkill /PID <pid> /F

# Start MySQL service (Windows)
net start mysql

# Start MySQL service (Linux/Mac)
sudo systemctl start mysql
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## About Benedicto College

**Mission**: Your Education… Our Mission
**Vision**: Globally competitive institution in the Asia-Pacific region

For more information, visit [benedictocollege.edu.ph](https://benedictocollege.edu.ph/)