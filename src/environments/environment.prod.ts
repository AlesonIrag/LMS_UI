// Environment configuration for production
export const environment = {
  production: true,
  apiUrl: '', // Will be updated when backend is deployed
  backendUrl: '', // Will be updated when backend is deployed
  
  // API endpoints
  endpoints: {
    auth: '/auth',
    adminAuth: '/adminauth',
    facultyAuth: '/facultyauth',
    weather: '/weather',
    health: '/'
  },
  
  // Production settings
  enableLogging: false,
  enableDebugMode: false,
  
  // CORS settings for production
  allowedOrigins: [
    'https://your-frontend-domain.com',
    'https://your-backend-domain.com'
  ],

  // Connection retry settings for production
  connectionRetry: {
    maxRetries: 5,
    retryDelay: 3000,
    timeout: 15000
  }
};
