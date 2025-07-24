import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { WeatherLoggerService } from '../services/weather-logger.service';
import { StudentAuthService } from '../services/student-auth.service';

interface WeatherResponse {
  success: boolean;
  data: {
    temperature: number;
    location: string;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
    timestamp: string;
    fallback?: boolean;
  };
  message?: string;
}

interface LibraryStats {
  books: number;
  members: number;
  activeToday: number;
}

interface StudentStats {
  borrowed: number;
  returned: number;
  reservations: number;
  fines: number;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  location: string;
  availability: 'Available' | 'Checked Out' | 'Reserved' | 'Maintenance';
  coverImage?: string;
  description?: string;
  publishedYear?: number;
  publisher?: string;
}

interface Loan {
  id: string;
  bookId: string;
  book: Book;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalCount: number;
  maxRenewals: number;
  status: 'Active' | 'Overdue' | 'Returned';
  fineAmount?: number;
}

interface Reservation {
  id: string;
  bookId: string;
  book: Book;
  reservationDate: Date;
  expiryDate: Date;
  status: 'Active' | 'Ready' | 'Expired' | 'Fulfilled';
  queuePosition?: number;
}

interface Fine {
  id: string;
  loanId?: string;
  type: 'Overdue' | 'Lost Book' | 'Damage' | 'Late Return';
  amount: number;
  description: string;
  dateIssued: Date;
  datePaid?: Date;
  status: 'Pending' | 'Paid' | 'Waived';
}

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessagesContainer') chatMessagesRef!: ElementRef;

  private weatherSubscription?: Subscription;
  private statsSubscription?: Subscription;

  // Dark mode and mobile menu state
  isDarkMode: boolean = false;
  isMobileMenuOpen: boolean = false;

  // Logout modal state
  showLogoutModal: boolean = false;

  // Chat widget state
  isChatOpen: boolean = false;
  showTooltip: boolean = false;
  chatInput: string = '';
  isTyping: boolean = false;
  avatarError: boolean = false;
  hasUnreadMessages: boolean = false;
  unreadCount: number = 0;

  // Weather data
  temperature: string = '31°C';
  location: string = 'Cebu City';
  weatherIcon: string = 'sunny';

  // Library stats
  stats: LibraryStats = {
    books: 3456,
    members: 1230,
    activeToday: 87
  };

  // Student-specific stats
  studentStats: StudentStats = {
    borrowed: 3,
    returned: 27,
    reservations: 2,
    fines: 25
  };

  // Search functionality
  searchQuery: string = '';
  isSearching: boolean = false;

  // View management
  currentView: string = 'dashboard';

  // Data collections
  availableBooks: Book[] = [];
  currentLoans: Loan[] = [];
  reservations: Reservation[] = [];
  borrowingHistory: Loan[] = [];
  fines: Fine[] = [];

  // Pagination and filtering
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchFilter: string = '';
  categoryFilter: string = 'all';
  statusFilter: string = 'all';

  // News and announcements
  latestNews = [
    { text: 'Library closed on July 12.', type: 'warning', color: 'red' },
    { text: 'New Science books available!', type: 'info', color: 'green' },
    { text: 'Join the Reading Challenge.', type: 'event', color: 'blue' }
  ];

  announcements = [
    {
      text: 'Return books by July 10 to avoid fees.',
      time: '2 hours ago',
      icon: 'megaphone'
    }
  ];

  // Chat messages
  chatMessages: ChatMessage[] = [
    {
      text: "I'm looking for books about computer science",
      isUser: true,
      time: "2:30 PM"
    },
    {
      text: "Great! I found several computer science books. Would you like me to show you programming books, algorithms, or general computer science?",
      isUser: false,
      time: "2:31 PM"
    },
    {
      text: "Programming books please",
      isUser: true,
      time: "2:32 PM"
    },
    {
      text: "Perfect! Here are some popular programming books available: 'Clean Code' by Robert Martin, 'JavaScript: The Good Parts' by Douglas Crockford, and 'Python Crash Course' by Eric Matthes. Would you like me to check their availability?",
      isUser: false,
      time: "2:32 PM"
    }
  ];

  constructor(
    private http: HttpClient,
    private weatherLogger: WeatherLoggerService,
    private studentAuthService: StudentAuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🎯 Student Dashboard component initialized successfully!');
    console.log('📊 Loading student dashboard data...');

    // Perform startup tests and logging
    await this.weatherLogger.performStartupTests();

    this.loadWeatherData();
    this.startStatsUpdates();
    this.animateCounters();
    this.loadDarkModePreference();
    this.initializeStudentData();

    // Update weather every 10 minutes
    this.weatherSubscription = interval(600000).subscribe(() => {
      this.weatherLogger.info('Scheduled weather update triggered');
      this.loadWeatherData();
    });

    // Update stats every 30 seconds
    this.statsSubscription = interval(30000).subscribe(() => {
      this.updateStats();
    });
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
    this.statsSubscription?.unsubscribe();
  }

  private loadWeatherData(): void {
    // Call backend weather API instead of OpenWeatherMap directly
    const backendUrl = 'http://localhost:3000/api/v1/weather';

    this.http.get<WeatherResponse>(backendUrl).subscribe({
      next: (response) => {
        if (response.success) {
          const data = response.data;
          this.temperature = `${data.temperature}°C`;
          this.location = data.location;
          this.updateWeatherIcon(data.condition);

          // Log weather update
          this.weatherLogger.logWeatherUpdate(this.temperature, this.location);

          // Update DOM elements (both desktop and mobile)
          setTimeout(() => {
            const tempElement = document.getElementById('temperature');
            const locationElement = document.getElementById('location');
            const tempElementMobile = document.getElementById('temperature-mobile');
            const locationElementMobile = document.getElementById('location-mobile');

            if (tempElement) tempElement.textContent = this.temperature;
            if (locationElement) locationElement.textContent = this.location;
            if (tempElementMobile) tempElementMobile.textContent = this.temperature;
            if (locationElementMobile) locationElementMobile.textContent = this.location;
          }, 100);

          // Log if using fallback data
          if (data.fallback) {
            this.weatherLogger.warning('Backend returned fallback weather data');
          } else {
            this.weatherLogger.success('Real weather data received from backend');
          }
        } else {
          throw new Error('Backend weather API returned error');
        }
      },
      error: (error) => {
        this.weatherLogger.error(`Backend weather API error: ${error.message}`);
        if (error.status === 0) {
          this.weatherLogger.logBackendNotRunning();
        }
        // Fallback to simulated data if backend fails
        this.simulateWeatherData();
      }
    });
  }

  private simulateWeatherData(): void {
    const temps = [29, 30, 31, 32, 33];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    this.temperature = `${randomTemp}°C`;
    this.location = 'Cebu City';

    // Log fallback usage
    this.weatherLogger.warning('Using simulated weather data as fallback');
    this.weatherLogger.logWeatherUpdate(this.temperature, this.location + ' (simulated)');

    // Update DOM elements (both desktop and mobile)
    setTimeout(() => {
      const tempElement = document.getElementById('temperature');
      const locationElement = document.getElementById('location');
      const tempElementMobile = document.getElementById('temperature-mobile');
      const locationElementMobile = document.getElementById('location-mobile');

      if (tempElement) tempElement.textContent = this.temperature;
      if (locationElement) locationElement.textContent = this.location;
      if (tempElementMobile) tempElementMobile.textContent = this.temperature;
      if (locationElementMobile) locationElementMobile.textContent = this.location;
    }, 100);
  }

  private updateWeatherIcon(condition: string): void {
    const iconElement = document.getElementById('weather-icon');
    if (!iconElement) return;

    let iconPath = '';
    switch (condition.toLowerCase()) {
      case 'clear':
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
        break;
      case 'clouds':
        iconPath = 'M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z';
        break;
      case 'rain':
        iconPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
        break;
      default:
        iconPath = 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z';
    }

    iconElement.innerHTML = `<path d="${iconPath}"/>`;
  }

  private startStatsUpdates(): void {
    // Simulate real-time stats updates
    this.updateStats();
  }

  private updateStats(): void {
    // Simulate dynamic stats changes
    const booksVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const membersVariation = Math.floor(Math.random() * 6) - 3; // -3 to +3
    const activeVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10

    this.stats.books = Math.max(3400, this.stats.books + booksVariation);
    this.stats.members = Math.max(1200, this.stats.members + membersVariation);
    this.stats.activeToday = Math.max(50, Math.min(150, this.stats.activeToday + activeVariation));

    // Update DOM elements (both desktop and mobile)
    setTimeout(() => {
      const booksElement = document.getElementById('books-count');
      const membersElement = document.getElementById('members-count');
      const activeElement = document.getElementById('active-count');
      const booksElementMobile = document.getElementById('books-count-mobile');
      const membersElementMobile = document.getElementById('members-count-mobile');
      const activeElementMobile = document.getElementById('active-count-mobile');

      if (booksElement) booksElement.textContent = this.stats.books.toLocaleString();
      if (membersElement) membersElement.textContent = this.stats.members.toLocaleString();
      if (activeElement) activeElement.textContent = this.stats.activeToday.toString();
      if (booksElementMobile) booksElementMobile.textContent = this.stats.books.toLocaleString();
      if (membersElementMobile) membersElementMobile.textContent = this.stats.members.toLocaleString();
      if (activeElementMobile) activeElementMobile.textContent = this.stats.activeToday.toString();
    }, 100);
  }

  private animateCounters(): void {
    // Animate the counter numbers on page load
    setTimeout(() => {
      const counters = document.querySelectorAll('#books-count, #members-count, #active-count');

      counters.forEach((counter) => {
        const target = parseInt(counter.textContent || '0');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };

        updateCounter();
      });
    }, 500);
  }

  // Navigation methods
  onLogout(): void {
    this.showLogoutModal = true;
  }

  // Logout modal methods
  confirmLogout(): void {
    console.log('🚪 Student confirming logout...');

    // Clear authentication state using proper student auth service
    this.studentAuthService.logout();

    // Close modal
    this.showLogoutModal = false;

    // Force navigation to login page
    console.log('🔄 Redirecting to login page...');
    this.router.navigate(['/login']).then(() => {
      console.log('✅ Successfully navigated to login');
    }).catch(() => {
      // Fallback navigation
      console.log('⚠️ Router navigation failed, using window.location');
      window.location.href = '/login';
    });
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  onNavigate(section: string): void {
    console.log(`Student navigating to ${section}`);
    this.currentView = section;
    this.currentPage = 1; // Reset pagination when switching views
  }

  // Quick search methods
  onQuickSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.isSearching = true;
    console.log(`Student searching for: ${this.searchQuery}`);

    // Simulate search delay
    setTimeout(() => {
      this.performSearch();
      this.isSearching = false;
    }, 1500);
  }

  private performSearch(): void {
    // Mock search implementation - replace with actual API call
    console.log(`Performing search for: ${this.searchQuery}`);
    // Here you would typically call a search service
    // this.bookService.searchBooks(this.searchQuery).subscribe(...)

    // For now, just clear the search query after "search"
    this.searchQuery = '';
  }

  // Quick Links methods
  onQuickLink(action: string): void {
    console.log(`Student quick link: ${action}`);

    switch (action) {
      case 'search':
        console.log('Opening book search...');
        // Navigate to book search page
        break;
      case 'renew':
        console.log('Opening book renewal...');
        // Navigate to loan renewal page
        break;
      case 'pay-fines':
        console.log('Opening fine payment...');
        // Navigate to fine payment page
        break;
      case 'reserve':
        console.log('Opening book reservation...');
        // Navigate to book reservation page
        break;
      case 'study-rooms':
        console.log('Opening study room booking...');
        // Navigate to study room booking page
        break;
      case 'research-help':
        console.log('Opening research help...');
        // Navigate to research assistance page
        break;
      default:
        console.log('Unknown quick link action:', action);
    }
  }

  // Notification methods
  onNotificationClick(): void {
    console.log('Student notifications clicked');
    // Implement notification panel toggle
  }

  onProfileClick(): void {
    console.log('Student profile clicked');
    // Implement profile menu toggle
  }

  // Utility methods for template
  getNewsItemClass(color: string): string {
    const baseClasses = 'w-2 h-2 rounded-full mr-3';
    switch (color) {
      case 'red': return `${baseClasses} bg-red-500`;
      case 'green': return `${baseClasses} bg-green-500`;
      case 'blue': return `${baseClasses} bg-blue-500`;
      default: return `${baseClasses} bg-gray-500`;
    }
  }

  // Demo method to add new announcements
  addAnnouncement(text: string): void {
    const newAnnouncement = {
      text: text,
      time: 'Just now',
      icon: 'megaphone'
    };

    this.announcements.unshift(newAnnouncement);

    // Remove old announcements if more than 5
    if (this.announcements.length > 5) {
      this.announcements = this.announcements.slice(0, 5);
    }
  }

  // Demo method to update news
  addNews(text: string, type: string = 'info', color: string = 'blue'): void {
    const newNews = { text, type, color };
    this.latestNews.unshift(newNews);

    // Keep only latest 5 news items
    if (this.latestNews.length > 5) {
      this.latestNews = this.latestNews.slice(0, 5);
    }
  }

  // Dark mode methods
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.saveDarkModePreference();
  }

  private loadDarkModePreference(): void {
    const savedPreference = localStorage.getItem('darkMode');
    this.isDarkMode = savedPreference === 'true';
  }

  private saveDarkModePreference(): void {
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // CSS class helpers
  getAsideClasses(): string {
    const baseClasses = 'lg:translate-x-0';
    const darkClasses = this.isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    return `${baseClasses} ${darkClasses}`;
  }

  getMainContentClasses(): string {
    return this.isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  }

  getCardClasses(): string {
    return this.isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  }

  getTextClasses(): string {
    return this.isDarkMode ? 'text-white' : 'text-gray-900';
  }

  getSecondaryTextClasses(): string {
    return this.isDarkMode ? 'text-gray-300' : 'text-gray-700';
  }

  getHeaderClasses(): string {
    const darkClasses = this.isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    return `shadow-sm border-b px-6 py-4 ${darkClasses}`;
  }

  // Chat widget methods
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    this.showTooltip = false;

    if (this.isChatOpen) {
      this.hasUnreadMessages = false;
      this.unreadCount = 0;
      // Scroll to bottom when opening chat
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  sendMessage(): void {
    if (!this.chatInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      text: this.chatInput,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.chatMessages.push(userMessage);
    this.chatInput = '';

    // Scroll to bottom
    setTimeout(() => {
      this.scrollToBottom();
    }, 50);

    // Show typing indicator
    this.isTyping = true;

    // Simulate AI response
    setTimeout(() => {
      this.isTyping = false;
      const aiResponse = this.generateAIResponse(userMessage.text);
      const aiMessage: ChatMessage = {
        text: aiResponse,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.chatMessages.push(aiMessage);

      // Scroll to bottom
      setTimeout(() => {
        this.scrollToBottom();
      }, 50);

      // If chat is closed, show notification
      if (!this.isChatOpen) {
        this.hasUnreadMessages = true;
        this.unreadCount++;
      }
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  }

  private generateAIResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Simple keyword-based responses for students
    if (message.includes('book') || message.includes('find')) {
      const responses = [
        "I can help you find books! What subject or genre are you interested in?",
        "Sure! Are you looking for fiction, non-fiction, or academic books?",
        "I'd be happy to help you find books. Could you tell me more about what you're looking for?",
        "Great! What type of books are you searching for? I can check our catalog for you."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (message.includes('science') || message.includes('computer') || message.includes('programming')) {
      return "Excellent choice! We have a great collection of science and technology books. I can show you books on programming, computer science, physics, chemistry, and more. Which specific area interests you?";
    }

    if (message.includes('fiction') || message.includes('novel') || message.includes('story')) {
      return "Our fiction section is amazing! We have classic literature, contemporary novels, mystery, romance, sci-fi, and fantasy. What genre would you like to explore?";
    }

    if (message.includes('available') || message.includes('check')) {
      return "I can check book availability for you! Please provide the title or author name, and I'll see if it's currently available for borrowing.";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to the Benedicto College Library. I'm BC-AI, your virtual library assistant. How can I help you find books today?";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm always here to help you find the perfect books. Is there anything else you'd like to know about our library?";
    }

    if (message.includes('help')) {
      return "I'm here to help! I can assist you with finding books, checking availability, getting information about library services, and answering questions about our collection. What would you like to know?";
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Could you tell me more about what you're looking for?",
      "I'd be happy to help you with that. Can you provide more details?",
      "Let me help you find what you need. Could you be more specific about your request?",
      "I'm here to assist you with library resources. What specific information do you need?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesRef) {
        const element = this.chatMessagesRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onAvatarError(event: any): void {
    this.avatarError = true;
    // Hide the broken image
    event.target.style.display = 'none';
  }

  // Action methods for different views
  borrowBook(bookId: string): void {
    console.log(`Borrowing book: ${bookId}`);
    // Implement book borrowing logic
    const book = this.availableBooks.find(b => b.id === bookId);
    if (book && book.availability === 'Available') {
      // Create new loan
      const newLoan: Loan = {
        id: `L${Date.now()}`,
        bookId: bookId,
        book: book,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        renewalCount: 0,
        maxRenewals: 3,
        status: 'Active'
      };

      this.currentLoans.push(newLoan);
      book.availability = 'Checked Out';
      this.updateStudentStats();

      console.log('Book borrowed successfully!');
    }
  }

  renewLoan(loanId: string): void {
    console.log(`Renewing loan: ${loanId}`);
    const loan = this.currentLoans.find(l => l.id === loanId);
    if (loan && loan.renewalCount < loan.maxRenewals && loan.status !== 'Overdue') {
      loan.renewalCount++;
      loan.dueDate = new Date(loan.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000); // Add 14 days
      console.log('Loan renewed successfully!');
    }
  }

  reserveBook(bookId: string): void {
    console.log(`Reserving book: ${bookId}`);
    const book = this.availableBooks.find(b => b.id === bookId);
    if (book && book.availability === 'Checked Out') {
      const newReservation: Reservation = {
        id: `R${Date.now()}`,
        bookId: bookId,
        book: book,
        reservationDate: new Date(),
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'Active',
        queuePosition: this.reservations.filter(r => r.bookId === bookId).length + 1
      };

      this.reservations.push(newReservation);
      this.updateStudentStats();
      console.log('Book reserved successfully!');
    }
  }

  cancelReservation(reservationId: string): void {
    console.log(`Cancelling reservation: ${reservationId}`);
    const index = this.reservations.findIndex(r => r.id === reservationId);
    if (index > -1) {
      this.reservations.splice(index, 1);
      this.updateStudentStats();
      console.log('Reservation cancelled successfully!');
    }
  }

  payFine(fineId: string): void {
    console.log(`Paying fine: ${fineId}`);
    const fine = this.fines.find(f => f.id === fineId);
    if (fine && fine.status === 'Pending') {
      fine.status = 'Paid';
      fine.datePaid = new Date();
      this.updateStudentStats();
      console.log('Fine paid successfully!');
    }
  }

  private updateStudentStats(): void {
    this.studentStats.borrowed = this.currentLoans.filter(l => l.status === 'Active' || l.status === 'Overdue').length;
    this.studentStats.returned = this.borrowingHistory.filter(l => l.status === 'Returned').length;
    this.studentStats.reservations = this.reservations.filter(r => r.status === 'Active' || r.status === 'Ready').length;
    this.studentStats.fines = this.fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  }

  // Utility methods
  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Ready': return 'text-blue-600 bg-blue-100';
      case 'Expired': return 'text-gray-600 bg-gray-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Paid': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-100';
      case 'Checked Out': return 'text-red-600 bg-red-100';
      case 'Reserved': return 'text-yellow-600 bg-yellow-100';
      case 'Maintenance': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  // Pagination methods
  get paginatedItems(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    switch (this.currentView) {
      case 'borrow':
        return this.filteredBooks.slice(startIndex, endIndex);
      case 'loans':
        return this.currentLoans.slice(startIndex, endIndex);
      case 'reservations':
        return this.reservations.slice(startIndex, endIndex);
      case 'history':
        return this.borrowingHistory.slice(startIndex, endIndex);
      case 'fines':
        return this.fines.slice(startIndex, endIndex);
      default:
        return [];
    }
  }

  get filteredBooks(): Book[] {
    let filtered = this.availableBooks;

    if (this.searchFilter) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchFilter.toLowerCase()) ||
        book.category.toLowerCase().includes(this.searchFilter.toLowerCase())
      );
    }

    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(book => book.category === this.categoryFilter);
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(book => book.availability === this.statusFilter);
    }

    return filtered;
  }

  get totalPages(): number {
    const totalItems = this.currentView === 'borrow' ? this.filteredBooks.length :
                      this.currentView === 'loans' ? this.currentLoans.length :
                      this.currentView === 'reservations' ? this.reservations.length :
                      this.currentView === 'history' ? this.borrowingHistory.length :
                      this.currentView === 'fines' ? this.fines.length : 0;

    return Math.ceil(totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Calculation methods for templates
  getTotalOutstandingFines(): number {
    return this.fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  }

  getTotalPaidFines(): number {
    return this.fines.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  }

  getNavLinkClass(section: string): string {
    const baseClasses = 'nav-link';
    const activeClasses = this.currentView === section ? 'active' : '';
    return `${baseClasses} ${activeClasses}`.trim();
  }

  // Data initialization
  private initializeStudentData(): void {
    this.loadAvailableBooks();
    this.loadCurrentLoans();
    this.loadReservations();
    this.loadBorrowingHistory();
    this.loadFines();
    this.updateStudentStats();
  }

  private loadAvailableBooks(): void {
    // Mock data - replace with actual API call
    this.availableBooks = [
      {
        id: '1',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        isbn: '978-0262033848',
        category: 'Computer Science',
        location: 'CS Section - Shelf A3',
        availability: 'Available',
        publishedYear: 2009,
        publisher: 'MIT Press',
        description: 'A comprehensive textbook on computer algorithms.'
      },
      {
        id: '2',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        category: 'Programming',
        location: 'CS Section - Shelf B1',
        availability: 'Available',
        publishedYear: 2008,
        publisher: 'Prentice Hall',
        description: 'A handbook of agile software craftsmanship.'
      },
      {
        id: '3',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        isbn: '978-0078022159',
        category: 'Database',
        location: 'CS Section - Shelf C2',
        availability: 'Checked Out',
        publishedYear: 2019,
        publisher: 'McGraw-Hill',
        description: 'Comprehensive introduction to database systems.'
      },
      {
        id: '4',
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        isbn: '978-1285741550',
        category: 'Mathematics',
        location: 'Math Section - Shelf M1',
        availability: 'Available',
        publishedYear: 2015,
        publisher: 'Cengage Learning',
        description: 'Complete calculus textbook for engineering students.'
      },
      {
        id: '5',
        title: 'Physics for Scientists and Engineers',
        author: 'Raymond A. Serway',
        isbn: '978-1133947271',
        category: 'Physics',
        location: 'Science Section - Shelf P2',
        availability: 'Reserved',
        publishedYear: 2013,
        publisher: 'Cengage Learning',
        description: 'Comprehensive physics textbook with modern applications.'
      }
    ];
  }

  private loadCurrentLoans(): void {
    // Mock data - replace with actual API call
    // Find books by ID to ensure proper references
    const book1 = this.availableBooks.find(b => b.id === '1')!;
    const book2 = this.availableBooks.find(b => b.id === '2')!;
    const book4 = this.availableBooks.find(b => b.id === '4')!;

    this.currentLoans = [
      {
        id: 'L001',
        bookId: '1',
        book: book1,
        borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        renewalCount: 1,
        maxRenewals: 3,
        status: 'Active'
      },
      {
        id: 'L002',
        bookId: '2',
        book: book2,
        borrowDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        renewalCount: 0,
        maxRenewals: 3,
        status: 'Active'
      },
      {
        id: 'L003',
        bookId: '4',
        book: book4,
        borrowDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), // 16 days ago
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
        renewalCount: 2,
        maxRenewals: 3,
        status: 'Overdue',
        fineAmount: 10 // ₱5 per day * 2 days
      }
    ];
  }

  private loadReservations(): void {
    // Mock data - replace with actual API call
    const book3 = this.availableBooks.find(b => b.id === '3')!;
    const book5 = this.availableBooks.find(b => b.id === '5')!;

    this.reservations = [
      {
        id: 'R001',
        bookId: '3',
        book: book3,
        reservationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        expiryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        status: 'Active',
        queuePosition: 2
      },
      {
        id: 'R002',
        bookId: '5',
        book: book5,
        reservationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        status: 'Ready',
        queuePosition: 1
      }
    ];
  }

  private loadBorrowingHistory(): void {
    // Mock data - replace with actual API call
    const book1 = this.availableBooks.find(b => b.id === '1')!;
    const book2 = this.availableBooks.find(b => b.id === '2')!;

    this.borrowingHistory = [
      {
        id: 'L004',
        bookId: '1',
        book: book1,
        borrowDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        renewalCount: 0,
        maxRenewals: 3,
        status: 'Returned'
      },
      {
        id: 'L005',
        bookId: '2',
        book: book2,
        borrowDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000),
        returnDate: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000),
        renewalCount: 1,
        maxRenewals: 3,
        status: 'Returned'
      }
    ];
  }

  private loadFines(): void {
    // Mock data - replace with actual API call
    this.fines = [
      {
        id: 'F001',
        loanId: 'L003',
        type: 'Overdue',
        amount: 10,
        description: 'Late return fee for "Calculus: Early Transcendentals"',
        dateIssued: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: 'Pending'
      },
      {
        id: 'F002',
        type: 'Late Return',
        amount: 15,
        description: 'Late return fee for "Physics for Scientists and Engineers"',
        dateIssued: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        datePaid: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        status: 'Paid'
      }
    ];
  }

}
