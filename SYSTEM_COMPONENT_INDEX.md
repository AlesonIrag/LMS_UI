# 📚 Library Management System - Component Index

## 🏗️ System Architecture Overview

### Frontend (Angular 20+)
- **Framework**: Angular 20+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Angular Services and RxJS
- **Routing**: Angular Router with Guards
- **Build System**: Angular CLI

### Backend (Node.js)
- **Framework**: Express.js
- **Database**: MySQL/MariaDB
- **Authentication**: JWT-based authentication
- **File Storage**: Sharp image optimization
- **API Documentation**: Custom RESTful endpoints

## 👥 User Roles and Authentication

### 1. Student Users
- **Authentication**: Student ID (YYYY-NNNNN format) + Password
- **Login Component**: `src/app/login/`
- **Service**: `src/app/services/student-auth.service.ts`
- **Dashboard**: `src/app/student-dashboard/`
- **Profile**: `src/app/student-profile/`

### 2. Faculty Users
- **Authentication**: Faculty ID + Password
- **Login Component**: `src/app/faculty-login/`
- **Service**: `src/app/services/faculty-auth.service.ts`
- **Dashboard**: `src/app/faculty-dashboard/`
- **Profile**: `src/app/faculty-profile/`

### 3. Admin Users
- **Authentication**: Email + Password
- **Login Component**: `src/app/admin-login/`
- **Service**: `src/app/services/auth.service.ts`
- **Dashboard**: `src/app/dashboard/`
- **Profile**: Accessible through dashboard

## 🔐 Authentication System

### JWT Implementation
- **Token Management**: LocalStorage storage
- **Token Validation**: HTTP Interceptors
- **Session Handling**: Automatic token refresh
- **Role-Based Access**: Admin, Faculty, Student roles

### Security Features
- **Password Hashing**: bcryptjs
- **Input Validation**: express-validator and frontend validation
- **Rate Limiting**: express-rate-limit
- **CORS Configuration**: Secure origin restrictions
- **Security Headers**: Helmet.js

## 🖥️ Frontend Components

### Core Pages
1. **Landing Page** (`src/app/landing/`)
2. **Login Pages**:
   - Student Login (`src/app/login/`)
   - Faculty Login (`src/app/faculty-login/`)
   - Admin Login (`src/app/admin-login/`)
3. **Forgot Password** (`src/app/forgot-password/`)
4. **Static Pages**:
   - About (`src/app/about/`)
   - Contact (`src/app/contact/`)
   - Privacy Policy (`src/app/privacy-policy/`)
   - Terms of Service (`src/app/terms-of-service/`)
   - Support (`src/app/support/`)

### Dashboards

#### Admin Dashboard (`src/app/dashboard/`)
- **Overview Component**: System statistics and real-time data
- **Books Management**: Complete catalog with CRUD operations
- **Students Management**: Student accounts and information
- **Faculty Management**: Faculty accounts and information
- **Admin Management**: Admin accounts and roles
- **Reports Section**: Data analytics and reporting
- **Borrowing Management**: Transaction tracking
- **Reservation System**: Book reservation handling
- **System Settings**: Configuration management
- **Activity Logs**: Audit trail and monitoring
- **Cataloging Tools**: Book categorization and organization

#### Student Dashboard (`src/app/student-dashboard/`)
- **Overview**: Personalized greeting and quick stats
- **Book Search**: Advanced catalog search
- **Current Loans**: Active borrowing transactions
- **Reservation System**: Book reservation management
- **Borrowing History**: Past transactions
- **Fine Management**: Outstanding and paid fines
- **Profile Management**: Account settings and photo upload

#### Faculty Dashboard (`src/app/faculty-dashboard/`)
- **Overview**: Faculty-specific greeting and stats
- **Extended Book Access**: Longer loan periods and renewals
- **Course Materials**: Academic resource management
- **Research Tools**: Specialized research databases
- **Reading Lists**: Course-specific book collections
- **Profile Management**: Faculty account settings

### Shared Components
- **Footer** (`src/app/shared/components/footer.component.ts`)
- **Navigation**: Responsive menus for all device sizes
- **Modals**: Reusable dialog components
- **Forms**: Validation and submission handling
- **Widgets**: Reusable dashboard components

### Services
1. **Authentication Services**:
   - AuthService (`src/app/services/auth.service.ts`) - Admin auth
   - StudentAuthService (`src/app/services/student-auth.service.ts`)
   - FacultyAuthService (`src/app/services/faculty-auth.service.ts`)

2. **Utility Services**:
   - WeatherLoggerService (`src/app/services/weather-logger.service.ts`)
   - ThemeService (`src/app/services/theme.service.ts`)
   - BookService (`src/app/services/book.service.ts`)
   - AnnouncementService (`src/app/services/announcement.service.ts`)
   - NotificationService (`src/app/services/notification.service.ts`)
   - QuoteService (`src/app/services/quote.service.ts`)

3. **Guards**:
   - AdminGuard (`src/app/guards/admin.guard.ts`)
   - StudentGuard (`src/app/guards/student.guard.ts`)
   - FacultyGuard (`src/app/guards/faculty.guard.ts`)

## ⚙️ Backend API Structure

### Core API Routes
1. **Authentication Routes** (`/api/v1/auth`)
   - Student login and session management
   - Profile retrieval and updates

2. **Admin Auth Routes** (`/api/v1/adminauth`)
   - Admin login and session management
   - Admin profile handling

3. **Faculty Auth Routes** (`/api/v1/facultyauth`)
   - Faculty login and session management
   - Faculty profile handling

4. **Weather Routes** (`/api/v1/weather`)
   - Real-time weather data integration
   - Fallback data handling

5. **Upload Routes** (`/api/v1/uploads`)
   - Profile photo upload and processing
   - File validation and storage

6. **Password Reset Routes** (`/api/v1/password-reset`)
   - Password recovery functionality
   - Token-based reset system

7. **Books Routes** (`/api/v1/books`)
   - Book catalog management
   - Search and filtering capabilities

8. **Borrowing Routes** (`/api/v1/borrowing`)
   - Transaction processing
   - Reservation handling

9. **System Settings Routes** (`/api/v1/system-settings`)
   - Configuration management
   - Credit year range handling

### Middleware
- **Security Middleware**: CORS, rate limiting, security headers
- **Authentication Middleware**: JWT token validation
- **Validation Middleware**: Request body validation
- **Error Handling**: Comprehensive error management
- **Logging**: Activity and error logging

## 🗄️ Database Schema

### Core Tables
1. **Students Table**
   - StudentID (Primary Key)
   - FullName, Course, YearLevel, Section
   - Email, PhoneNumber, Password
   - ProfilePhoto
   - EnrollmentStatus, AccountStatus

2. **Faculty Table**
   - FacultyID (Primary Key)
   - FullName, Email, PhoneNumber
   - Password, Department, Position
   - Status, ProfilePhoto

3. **Admins Table**
   - AdminID (Primary Key)
   - FullName, Email, Password
   - Role (Super Admin, Data Center Admin, Librarian, Librarian Staff)
   - Status, ProfilePhoto

4. **Books Table**
   - BookID (Primary Key)
   - Title, Author, ISBN, Category, Subject
   - PublishedYear, Publisher, CallNumber
   - Copies, Status, ShelfLocation

5. **Transactions Table**
   - TransactionID (Primary Key)
   - StudentID/FacultyID (Foreign Keys)
   - BookID (Foreign Key)
   - BorrowDate, DueDate, ReturnDate
   - Status (Pending, Borrowed, Returned, Overdue)

## 🎨 UI/UX Features

### Design System
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Theme switching capability
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Screen reader support and keyboard navigation

### Key UI Components
- **Chat Widget**: AI-powered virtual assistant (BC-AI)
- **Real-time Weather**: Location-based weather information
- **Quote of the Day**: Motivational quotes for users
- **Notification System**: Real-time alerts and updates
- **Interactive Dashboards**: Data visualization and metrics

## 🚀 Deployment Configuration

### Environment Support
- **Development**: Local development settings
- **Separated**: Frontend/backend separation mode
- **Production**: Production-ready configurations

### Containerization
- **Docker Support**: Frontend and backend Dockerfiles
- **Deployment Scripts**: Automated deployment workflows

### Hosting Options
- **Traditional Hosting**: Standard web server deployment
- **Cloud Platforms**: Render, Netlify, Cloudflare deployment guides
- **CI/CD Integration**: Automated testing and deployment

## 🧪 Testing and Quality Assurance

### Testing Frameworks
- **Unit Testing**: Jasmine and Karma for Angular components
- **Integration Testing**: API endpoint validation
- **End-to-End Testing**: User flow verification

### Code Quality
- **Type Safety**: TypeScript for error prevention
- **Code Linting**: ESLint for consistent code style
- **Formatting**: Prettier for code formatting standards

## 🔧 Development Workflow

### Scripts
```bash
npm run dev:full          # Start both frontend and backend
npm run dev:separated     # Start in separated mode
npm run backend:start     # Start backend only
npm start                 # Start frontend only
npm run setup            # Install all dependencies
```

### Development Features
- **Hot Reloading**: Automatic refresh during development
- **Error Boundaries**: Graceful error handling
- **Logging System**: Comprehensive activity tracking
- **Performance Monitoring**: Response time tracking

## 📱 Mobile Responsiveness

### Design Approach
- **Mobile-First**: Progressive enhancement strategy
- **Touch Optimization**: Mobile-friendly interactions
- **Adaptive Layouts**: Flexible grid systems
- **Performance**: Optimized for mobile networks

### Navigation
- **Mobile Menu**: Sliding sidebar for navigation
- **Responsive Tables**: Scrollable data displays
- **Touch Targets**: Appropriately sized interactive elements

## 🛡️ Security Features

### Authentication Security
- **JWT Tokens**: Secure stateless authentication
- **Password Encryption**: bcrypt hashing algorithm
- **Session Management**: Token expiration and refresh
- **Role-Based Access**: Permission-based routing

### Data Security
- **SQL Injection Prevention**: Parameterized queries
- **Input Sanitization**: XSS attack prevention
- **File Upload Security**: Type and size validation
- **Rate Limiting**: Brute force attack protection

## 📈 Performance Optimization

### Frontend Optimization
- **Lazy Loading**: Route-based code splitting
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategies**: Browser and HTTP caching
- **Image Optimization**: Responsive images and WebP format

### Backend Optimization
- **Database Connection Pooling**: Efficient resource usage
- **Query Optimization**: Indexing and efficient queries
- **Response Compression**: Gzip compression
- **Caching Layers**: In-memory and database caching

This comprehensive index provides an organized overview of the Library Management System's components, architecture, and features.