import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { WeatherLoggerService } from '../services/weather-logger.service';
import { FacultyAuthService } from '../services/faculty-auth.service';

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

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availability: string;
  location: string;
  description?: string;
  publishedYear?: number;
  publisher?: string;
}

interface Loan {
  id: number;
  book: Book;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  renewalCount: number;
  maxRenewals: number;
  fineAmount?: number;
}

interface Reservation {
  id: number;
  book: Book;
  reservationDate: Date;
  expiryDate: Date;
  status: string;
  queuePosition?: number;
}

interface Fine {
  id: number;
  type: string;
  description: string;
  amount: number;
  dateIssued: Date;
  datePaid?: Date;
  status: string;
}

interface FacultyStats {
  borrowed: number;
  returned: number;
  reservations: number;
  fines: number;
  courseMaterials: number;
  activeClasses: number;
  researchProjects: number;
}

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './faculty-dashboard.component.html',
  styleUrls: ['./faculty-dashboard.component.css']
})
export class FacultyDashboardComponent implements OnInit, OnDestroy {
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

  // Chat messages
  chatMessages: Array<{
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isTyping?: boolean;
  }> = [
    {
      id: 1,
      text: "Hello! I'm BC-AI, your library assistant. How can I help you find academic resources or research materials today?",
      isUser: false,
      timestamp: new Date()
    }
  ];

  // Current view state
  currentView: string = 'dashboard';

  // Search and filter states
  searchQuery: string = '';
  isSearching: boolean = false;
  searchFilter: string = '';
  categoryFilter: string = 'all';
  statusFilter: string = 'all';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  paginatedItems: any[] = [];

  // Faculty stats
  facultyStats: FacultyStats = {
    borrowed: 8,
    returned: 45,
    reservations: 3,
    fines: 0,
    courseMaterials: 25,
    activeClasses: 4,
    researchProjects: 2
  };

  // Data arrays
  availableBooks: Book[] = [];
  currentLoans: Loan[] = [];
  reservations: Reservation[] = [];
  borrowingHistory: Loan[] = [];
  fines: Fine[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private weatherLogger: WeatherLoggerService,
    private facultyAuthService: FacultyAuthService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('🎯 Faculty Dashboard component initialized successfully!');
    console.log('📊 Loading faculty dashboard data...');

    // Perform startup tests and logging
    await this.weatherLogger.performStartupTests();

    this.loadWeatherData();
    this.startStatsUpdates();
    this.animateCounters();
    this.loadDarkModePreference();
    this.initializeFacultyData();

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
        } else {
          this.weatherLogger.error('Weather API returned unsuccessful response');
          console.error('Weather API response:', response);
        }
      },
      error: (error) => {
        this.weatherLogger.error('Failed to fetch weather data');
        console.error('Weather fetch error:', error);
        // Keep existing values as fallback
      }
    });
  }

  private updateWeatherIcon(condition: string): void {
    const iconMap: { [key: string]: string } = {
      'clear': 'sunny',
      'sunny': 'sunny',
      'clouds': 'cloudy',
      'cloudy': 'cloudy',
      'rain': 'rainy',
      'rainy': 'rainy',
      'thunderstorm': 'stormy',
      'snow': 'snowy',
      'mist': 'foggy',
      'fog': 'foggy'
    };

    this.weatherIcon = iconMap[condition.toLowerCase()] || 'sunny';
  }

  private startStatsUpdates(): void {
    // Simulate real-time stats updates
    setInterval(() => {
      this.updateStats();
    }, 30000); // Update every 30 seconds
  }

  private updateStats(): void {
    // Simulate minor fluctuations in stats
    const variations = [-1, 0, 1];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    
    // Only update non-critical stats occasionally
    if (Math.random() > 0.7) {
      this.facultyStats.courseMaterials = Math.max(0, this.facultyStats.courseMaterials + randomVariation);
    }
  }

  private animateCounters(): void {
    // Animate the counter numbers on page load
    setTimeout(() => {
      const counters = document.querySelectorAll('[id$="-count"], [id$="-count-mobile"]');
      counters.forEach(counter => {
        const target = parseInt(counter.textContent || '0');
        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current).toString();
        }, 50);
      });
    }, 500);
  }

  private loadDarkModePreference(): void {
    const savedMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedMode === 'true';
  }

  private initializeFacultyData(): void {
    this.loadAvailableBooks();
    this.loadCurrentLoans();
    this.loadReservations();
    this.loadBorrowingHistory();
    this.loadFines();
    this.updateFacultyStats();
  }

  // Dark mode and UI methods
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Navigation methods
  onNavigate(view: string): void {
    this.currentView = view;
    this.updatePagination();
  }

  // Logout methods
  onLogout(): void {
    this.showLogoutModal = true;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.facultyAuthService.logout();
    this.router.navigate(['/facultylogin']);
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  // Chat widget methods
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.hasUnreadMessages = false;
      this.unreadCount = 0;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    if (!this.chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: this.chatInput,
      isUser: true,
      timestamp: new Date()
    };

    this.chatMessages.push(userMessage);
    const messageText = this.chatInput;
    this.chatInput = '';
    this.scrollToBottom();

    // Simulate AI typing
    this.isTyping = true;
    setTimeout(() => {
      this.simulateAIResponse(messageText);
    }, 1000 + Math.random() * 2000);
  }

  private simulateAIResponse(userMessage: string): void {
    const responses = this.getAIResponses(userMessage);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const aiMessage = {
      id: Date.now(),
      text: randomResponse,
      isUser: false,
      timestamp: new Date()
    };

    this.chatMessages.push(aiMessage);
    this.isTyping = false;
    this.scrollToBottom();

    if (!this.isChatOpen) {
      this.hasUnreadMessages = true;
      this.unreadCount++;
    }
  }

  private getAIResponses(userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('book') || lowerMessage.includes('find')) {
      return [
        "I can help you find academic books and research materials. What subject are you looking for?",
        "Our library has extensive collections in various fields. What specific topic interests you?",
        "I can search our catalog for books, journals, and digital resources. What do you need?"
      ];
    } else if (lowerMessage.includes('course') || lowerMessage.includes('material')) {
      return [
        "I can help you manage course materials and reading lists for your classes.",
        "Would you like assistance with organizing course resources or finding supplementary materials?",
        "I can help you create reading lists and find materials for your courses."
      ];
    } else if (lowerMessage.includes('research')) {
      return [
        "I can assist with research resources including databases, journals, and academic publications.",
        "Our research tools include access to academic databases and citation management systems.",
        "What type of research materials are you looking for? I can guide you to the right resources."
      ];
    } else {
      return [
        "I'm here to help faculty with library resources and academic materials!",
        "How can I assist you with your teaching and research needs?",
        "I can help you find academic resources, manage course materials, and more.",
        "Feel free to ask about books, research databases, or course material management!"
      ];
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesRef) {
        const element = this.chatMessagesRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  // Header interaction methods
  onNotificationClick(): void {
    console.log('Faculty notifications clicked');
    // Implement notification functionality
  }

  onProfileClick(): void {
    console.log('Faculty profile clicked');
    // Implement profile functionality
  }

  // Quick action methods
  onQuickSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.isSearching = true;
    console.log('Faculty searching for:', this.searchQuery);

    // Simulate search delay
    setTimeout(() => {
      this.isSearching = false;
      this.onNavigate('borrow');
      this.searchFilter = this.searchQuery;
    }, 1500);
  }

  onQuickLink(action: string): void {
    console.log('Faculty quick link clicked:', action);

    switch (action) {
      case 'search':
        this.onNavigate('borrow');
        break;
      case 'course-materials':
        this.onNavigate('course-materials');
        break;
      case 'research-tools':
        this.onNavigate('research-tools');
        break;
      case 'reading-lists':
        this.onNavigate('reading-lists');
        break;
      default:
        console.log('Unknown quick link action:', action);
    }
  }

  // Data loading methods
  private loadAvailableBooks(): void {
    // Mock data for faculty - academic and research focused books
    this.availableBooks = [
      {
        id: 1,
        title: "Advanced Database Systems",
        author: "Dr. Sarah Johnson",
        isbn: "978-0123456789",
        category: "Computer Science",
        availability: "Available",
        location: "CS Section - Shelf A1",
        description: "Comprehensive guide to modern database technologies",
        publishedYear: 2023,
        publisher: "Academic Press"
      },
      {
        id: 2,
        title: "Research Methodology in Education",
        author: "Prof. Michael Chen",
        isbn: "978-0987654321",
        category: "Education",
        availability: "Available",
        location: "Education Section - Shelf E3",
        description: "Essential methods for educational research",
        publishedYear: 2022,
        publisher: "Educational Publishers"
      },
      {
        id: 3,
        title: "Machine Learning Fundamentals",
        author: "Dr. Emily Rodriguez",
        isbn: "978-0456789123",
        category: "Computer Science",
        availability: "Checked Out",
        location: "CS Section - Shelf A2",
        description: "Introduction to ML concepts and applications",
        publishedYear: 2023,
        publisher: "Tech Publications"
      }
    ];
  }

  private loadCurrentLoans(): void {
    // Mock current loans for faculty
    this.currentLoans = [
      {
        id: 1,
        book: {
          id: 10,
          title: "Curriculum Development Theory",
          author: "Dr. Patricia Williams",
          isbn: "978-0111222333",
          category: "Education",
          availability: "Checked Out",
          location: "Education Section"
        },
        borrowDate: new Date('2024-06-15'),
        dueDate: new Date('2024-08-15'), // Faculty get longer loan periods
        status: 'Active',
        renewalCount: 0,
        maxRenewals: 5 // Faculty get more renewals
      },
      {
        id: 2,
        book: {
          id: 11,
          title: "Statistical Analysis in Research",
          author: "Prof. David Kim",
          isbn: "978-0444555666",
          category: "Mathematics",
          availability: "Checked Out",
          location: "Math Section"
        },
        borrowDate: new Date('2024-06-20'),
        dueDate: new Date('2024-08-20'),
        status: 'Active',
        renewalCount: 1,
        maxRenewals: 5
      }
    ];
  }

  private loadReservations(): void {
    // Mock reservations for faculty
    this.reservations = [
      {
        id: 1,
        book: {
          id: 20,
          title: "Advanced Teaching Methods",
          author: "Dr. Lisa Anderson",
          isbn: "978-0777888999",
          category: "Education",
          availability: "Reserved",
          location: "Education Section"
        },
        reservationDate: new Date('2024-07-01'),
        expiryDate: new Date('2024-07-15'),
        status: 'Active',
        queuePosition: 1
      }
    ];
  }

  private loadBorrowingHistory(): void {
    // Mock borrowing history for faculty
    this.borrowingHistory = [
      {
        id: 100,
        book: {
          id: 30,
          title: "Educational Psychology",
          author: "Dr. Robert Taylor",
          isbn: "978-0123123123",
          category: "Psychology",
          availability: "Available",
          location: "Psychology Section"
        },
        borrowDate: new Date('2024-05-01'),
        dueDate: new Date('2024-07-01'),
        returnDate: new Date('2024-06-28'),
        status: 'Returned',
        renewalCount: 0,
        maxRenewals: 5
      }
    ];
  }

  private loadFines(): void {
    // Faculty typically have fewer fines due to longer loan periods
    this.fines = [];
  }

  private updateFacultyStats(): void {
    this.facultyStats = {
      borrowed: this.currentLoans.length,
      returned: this.borrowingHistory.filter(h => h.status === 'Returned').length,
      reservations: this.reservations.length,
      fines: this.fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0),
      courseMaterials: 25, // Mock data
      activeClasses: 4,    // Mock data
      researchProjects: 2  // Mock data
    };
  }

  // Pagination methods
  private updatePagination(): void {
    let items: any[] = [];

    switch (this.currentView) {
      case 'borrow':
        items = this.getFilteredBooks();
        break;
      case 'loans':
        items = this.currentLoans;
        break;
      case 'reservations':
        items = this.reservations;
        break;
      case 'history':
        items = this.borrowingHistory;
        break;
      case 'fines':
        items = this.fines;
        break;
      default:
        items = [];
    }

    this.totalPages = Math.ceil(items.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedItems = items.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  private getFilteredBooks(): Book[] {
    let filtered = this.availableBooks;

    if (this.searchFilter) {
      const search = this.searchFilter.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.category.toLowerCase().includes(search)
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

  // CSS class helper methods
  getAsideClasses(): string {
    const baseClasses = 'lg:translate-x-0';
    const themeClasses = this.isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    return `${baseClasses} ${themeClasses}`;
  }

  getHeaderClasses(): string {
    const baseClasses = 'px-4 lg:px-6 py-4 border-b transition-colors duration-300';
    const themeClasses = this.isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
    return `${baseClasses} ${themeClasses}`;
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
    return this.isDarkMode ? 'text-gray-400' : 'text-gray-600';
  }

  getNavLinkClass(section: string): string {
    const baseClasses = 'nav-link';
    const activeClasses = this.currentView === section ? 'active' : '';
    const themeClasses = this.isDarkMode ?
      (this.currentView === section ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white') :
      (this.currentView === section ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900');
    return `${baseClasses} ${activeClasses} ${themeClasses}`.trim();
  }

  getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Checked Out':
        return 'bg-red-100 text-red-800';
      case 'Reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Returned':
        return 'bg-blue-100 text-blue-800';
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Faculty-specific action methods
  borrowBook(bookId: number): void {
    console.log('Faculty borrowing book:', bookId);
    // Implement faculty book borrowing logic
  }

  reserveBook(bookId: number): void {
    console.log('Faculty reserving book:', bookId);
    // Implement faculty book reservation logic
  }

  renewLoan(loanId: number): void {
    console.log('Faculty renewing loan:', loanId);
    // Implement faculty loan renewal logic
  }

  cancelReservation(reservationId: number): void {
    console.log('Faculty canceling reservation:', reservationId);
    // Implement faculty reservation cancellation logic
  }

  payFine(fineId: number): void {
    console.log('Faculty paying fine:', fineId);
    // Implement faculty fine payment logic
  }

  // Utility methods
  getDaysUntilDue(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getTotalOutstandingFines(): number {
    return this.fines.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);
  }

  getTotalPaidFines(): number {
    return this.fines.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  }
}
