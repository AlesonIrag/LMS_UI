# ⚙️ Library Management System - Backend Architecture

## 🏗️ Server Structure

### Project Organization
```
backend-api/
├── config/                        # Database and app configuration
├── middleware/                    # Security and validation layers
├── routes/                        # API endpoint handlers
├── services/                      # Business logic services
├── utils/                         # Utility functions and loggers
├── uploads/                       # File upload storage
│   └── profile-photos/           # User profile images
├── migrations/                    # Database schema updates
├── docs/                          # API documentation
├── scripts/                       # Utility scripts
├── node_modules/                  # Dependencies
├── package.json                  # Project metadata and scripts
├── server.js                     # Main application entry point
└── db.js                         # Database connection
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Student Authentication (`/api/v1/auth`)
- `POST /login` - Student login with ID and password
- `POST /validate-session` - Validate current student session
- `GET /profile/:studentId` - Retrieve student profile
- `PUT /update-student/:id` - Update student profile
- `GET /student/:id` - Get detailed student information

#### Admin Authentication (`/api/v1/adminauth`)
- `POST /login-admin` - Admin login with email and password
- `POST /validate-session` - Validate current admin session
- `GET /admin/:id` - Get admin profile details
- `PUT /update-admin/:id` - Update admin profile

#### Faculty Authentication (`/api/v1/facultyauth`)
- `POST /login-faculty` - Faculty login with ID and password
- `POST /validate-session` - Validate current faculty session
- `GET /faculty/:id` - Get faculty profile details
- `PUT /update-faculty/:id` - Update faculty profile

### Core System Endpoints

#### Weather Integration (`/api/v1/weather`)
- `GET /` - Current weather data
- `GET /forecast` - Weather forecast information

#### File Uploads (`/api/v1/uploads`)
- `POST /profile-photo/:id` - Upload user profile photo
- `GET /profile-photos/:filename` - Serve profile photos
- File validation and processing with Sharp

#### Password Reset (`/api/v1/password-reset`)
- `POST /request` - Request password reset
- `POST /validate-token` - Validate reset token
- `POST /reset` - Complete password reset

#### Books Management (`/api/v1/books`)
- `GET /` - Retrieve all books
- `GET /:id` - Get specific book details
- `POST /` - Add new book (admin only)
- `PUT /:id` - Update book information (admin only)
- `DELETE /:id` - Remove book (admin only)
- `GET /search` - Search books by criteria

#### Borrowing System (`/api/v1/borrowing`)
- `POST /borrow` - Create borrowing transaction
- `POST /return` - Process book return
- `POST /renew` - Renew borrowing period
- `GET /transactions/:userId` - Get user transactions
- `POST /create-reservation` - Create book reservation

#### System Settings (`/api/v1/system-settings`)
- `GET /credit-year-range` - Get system credit year range

#### Posts and Reactions (`/api/v1/`)
- `GET /posts` - Retrieve posts
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /reactions` - Add reaction to post
- `DELETE /reactions` - Remove reaction from post

### Public Endpoints
- `GET /` - Health check and server status
- `GET /api` - API documentation endpoint

## 🛡️ Middleware Stack

### Security Middleware
1. **CORS Configuration** (`middleware/security.js`)
   - Origin restrictions
   - Method and header controls
   - Credential handling

2. **Rate Limiting** (`middleware/security.js`)
   - Request throttling
   - IP-based limits
   - Burst protection

3. **Security Headers** (`middleware/security.js`)
   - Helmet.js integration
   - XSS protection
   - Content security policies

4. **Compression** (`middleware/security.js`)
   - Response compression
   - Gzip encoding

### Authentication Middleware
1. **JWT Validation**
   - Token verification
   - Expiration checking
   - Role validation

2. **Session Management**
   - Token refresh handling
   - Session timeout enforcement

### Validation Middleware
1. **Input Validation** (`middleware/validation.js`)
   - Request body validation
   - Parameter sanitization
   - Joi schema validation

2. **File Validation** (`middleware/fileValidation.js`)
   - File type checking
   - Size limitations
   - Security scanning

### Error Handling
1. **Global Error Handler** (`middleware/errorHandler.js`)
   - Centralized error processing
   - Logging integration
   - User-friendly responses

2. **404 Handler** (`middleware/errorHandler.js`)
   - Route not found handling
   - Custom 404 responses

## 🗄️ Database Layer

### Connection Management
- **Connection Pooling**: MariaDB connection pools
- **Environment Configuration**: Development/production settings
- **Error Handling**: Connection failure recovery

### Core Tables

#### Students Table
```sql
CREATE TABLE Students (
    StudentID VARCHAR(10) PRIMARY KEY,
    FullName VARCHAR(100),
    Course VARCHAR(50),
    YearLevel INT,
    Section VARCHAR(10),
    Email VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(20),
    Password VARCHAR(255),
    ProfilePhoto VARCHAR(255),
    EnrollmentStatus ENUM('Active', 'Inactive', 'Graduated'),
    AccountStatus ENUM('Active', 'Suspended', 'Disabled'),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Faculty Table
```sql
CREATE TABLE Faculty (
    FacultyID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    PhoneNumber VARCHAR(20),
    Password VARCHAR(255),
    Department VARCHAR(50),
    Position VARCHAR(50),
    Status ENUM('Active', 'Inactive', 'Suspended'),
    ProfilePhoto VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Admins Table
```sql
CREATE TABLE Admins (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Role ENUM('Super Admin', 'Data Center Admin', 'Librarian', 'Librarian Staff'),
    Status ENUM('Active', 'Inactive', 'Suspended'),
    ProfilePhoto VARCHAR(255),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Books Table
```sql
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200),
    Author VARCHAR(100),
    ISBN VARCHAR(20),
    Category VARCHAR(50),
    Subject VARCHAR(50),
    PublishedYear INT,
    Publisher VARCHAR(100),
    CallNumber VARCHAR(50),
    Copies INT DEFAULT 1,
    Status ENUM('Available', 'Checked Out', 'Reserved', 'Maintenance'),
    ShelfLocation VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Transactions Table
```sql
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID VARCHAR(50), -- Can be StudentID or FacultyID
    UserType ENUM('Student', 'Faculty'),
    BookID INT,
    BorrowDate DATE,
    DueDate DATE,
    ReturnDate DATE,
    Status ENUM('Pending', 'Borrowed', 'Returned', 'Overdue'),
    RenewalCount INT DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);
```

#### Additional Tables
1. **Reservations** - Book reservation tracking
2. **Fines** - Fine management and tracking
3. **Notifications** - User notification system
4. **SystemLogs** - Activity logging
5. **AdminAuditLogs** - Admin action tracking
6. **UserTokens** - Token management
7. **Reports** - Report generation data
8. **Posts** - User-generated content
9. **Reactions** - Content reactions

## 🔐 Security Implementation

### Authentication System
1. **JWT Tokens**
   - Asymmetric signing
   - Configurable expiration
   - Refresh token system

2. **Password Security**
   - bcryptjs hashing
   - Salt generation
   - Strength validation

3. **Session Management**
   - Token blacklisting
   - Session timeout
   - Concurrent session limits

### Data Protection
1. **SQL Injection Prevention**
   - Parameterized queries
   - Input sanitization
   - ORM usage

2. **XSS Prevention**
   - Output encoding
   - Content Security Policy
   - Input validation

3. **File Security**
   - Type validation
   - Size limits
   - Secure storage paths
   - Image processing with Sharp

### Network Security
1. **Rate Limiting**
   - Per-endpoint limits
   - IP-based restrictions
   - Burst control

2. **CORS Configuration**
   - Allowed origins
   - Method restrictions
   - Header controls

3. **Security Headers**
   - Helmet.js integration
   - HSTS implementation
   - Frame protection

## 📦 Services Layer

### Core Services
1. **AuthService** (`services/authService.js`)
   - User authentication
   - Token generation
   - Session validation

2. **BookService** (`services/bookService.js`)
   - Book management
   - Search functionality
   - Availability tracking

3. **BorrowingService** (`services/borrowingService.js`)
   - Transaction processing
   - Reservation handling
   - Fine calculation

4. **UploadService** (`services/uploadService.js`)
   - File validation
   - Image processing
   - Storage management

5. **WeatherService** (`services/weatherService.js`)
   - API integration
   - Data caching
   - Fallback handling

### Utility Services
1. **EmailService** (`services/emailService.js`)
   - Notification sending
   - Template management
   - Delivery tracking

2. **LoggingService** (`utils/logger.js`)
   - Activity logging
   - Error tracking
   - Performance monitoring

3. **ValidationService** (`services/validationService.js`)
   - Input validation
   - Data sanitization
   - Schema validation

## ⚡ Performance Optimization

### Database Optimization
1. **Indexing Strategy**
   - Primary key indexing
   - Foreign key optimization
   - Search field indexing

2. **Query Optimization**
   - Efficient JOIN operations
   - LIMIT and OFFSET usage
   - Caching strategies

3. **Connection Management**
   - Pool size configuration
   - Timeout settings
   - Error recovery

### API Optimization
1. **Response Caching**
   - In-memory caching
   - TTL configuration
   - Cache invalidation

2. **Request Compression**
   - Gzip compression
   - Stream processing
   - Size optimization

3. **Pagination**
   - Offset-based pagination
   - Cursor-based pagination
   - Limit controls

## 🔄 Data Flow Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates against database
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in subsequent requests
6. Backend validates token on protected routes

### File Upload Flow
1. User selects image file
2. Client-side validation (type, size)
3. File uploaded to backend endpoint
4. Server-side validation and processing
5. Image optimization with Sharp
6. Database URL storage
7. Response with image URL

### Borrowing Flow
1. User requests book borrowing
2. System validates availability
3. Transaction record created
4. Book status updated
5. Due date calculated
6. Notification sent to user

## 🧪 Testing Infrastructure

### Test Categories
1. **Unit Tests**
   - Service function testing
   - Utility function validation
   - Database query testing

2. **Integration Tests**
   - API endpoint validation
   - Database integration
   - Middleware testing

3. **Load Testing**
   - Concurrent user simulation
   - Performance benchmarking
   - Stress testing

### Testing Tools
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library
- **Mocking**: Database and API mocking

## 📈 Monitoring and Logging

### Logging System
1. **Activity Logs**
   - User actions
   - System events
   - Security events

2. **Error Logs**
   - Exception tracking
   - Stack traces
   - Frequency analysis

3. **Performance Logs**
   - Response times
   - Resource usage
   - Query performance

### Monitoring Features
1. **Health Checks**
   - Database connectivity
   - API responsiveness
   - External service status

2. **Metrics Collection**
   - Request rates
   - Error rates
   - System resource usage

3. **Alerting System**
   - Threshold-based alerts
   - Notification delivery
   - Escalation procedures

## 🚀 Deployment Configuration

### Environment Variables
- **Database Configuration**: Connection strings, credentials
- **API Keys**: External service keys
- **Security Settings**: JWT secrets, CORS origins
- **Feature Flags**: Toggle features on/off

### Server Configuration
- **Process Management**: PM2 or similar
- **Load Balancing**: Multiple instance support
- **SSL/TLS**: HTTPS configuration
- **Reverse Proxy**: Nginx integration

### Scaling Considerations
- **Horizontal Scaling**: Multiple server instances
- **Database Sharding**: Large dataset distribution
- **CDN Integration**: Static asset delivery
- **Microservices**: Component separation

This comprehensive documentation provides a detailed overview of the backend architecture of the Library Management System.