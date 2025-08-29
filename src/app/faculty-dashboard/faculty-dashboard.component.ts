import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { WeatherLoggerService } from '../services/weather-logger.service';
import { FacultyAuthService } from '../services/faculty-auth.service';
import { ThemeService } from '../services/theme.service';
import { AnnouncementService, Announcement, NewsItem } from '../services/announcement.service';

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

  // Mobile menu state
  isMobileMenuOpen: boolean = false;

  // Logout modal state
  showLogoutModal: boolean = false;

  // Profile modal state
  showProfileModal: boolean = false;
  profileModalTop: string = '70px';
  profileModalRight: string = '20px';

  @ViewChild('profileButton', { static: false }) profileButton!: ElementRef;

  // Profile photo properties
  currentUserInitial: string = 'F';
  currentUserProfilePhoto: string = '';
  currentUserName: string = 'Faculty';

  // Chat widget state
  isChatOpen: boolean = false;
  showTooltip: boolean = false;
  chatInput: string = '';
  isTyping: boolean = false;
  avatarError: boolean = false;
  hasUnreadMessages: boolean = false;
  unreadCount: number = 0;

  // Sidebar visibility state - Always show right sidebar
  isSidebarHidden: boolean = false;

  // Weather data
  temperature: string = '31°C';
  location: string = 'Cebu City';
  weatherIcon: string = 'sunny';

  // Chat messages
  chatMessages: Array<{
    text: string;
    isUser: boolean;
    time: string;
  }> = [];

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

  // Quote of the Day properties
  currentQuote: any = null;
  isQuoteLoading: boolean = false;
  quoteError: string | null = null;

  // Random Fact properties
  randomFact: string = 'Loading...';
  factError: string | null = null;

  // News and announcements - dynamic
  latestNews: NewsItem[] = [];
  announcements: Announcement[] = [];
  private announcementSubscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private weatherLogger: WeatherLoggerService,
    private facultyAuthService: FacultyAuthService,
    private themeService: ThemeService,
    private announcementService: AnnouncementService
  ) {}

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  async ngOnInit(): Promise<void> {
    console.log('🎯 Faculty Dashboard component initialized successfully!');
    console.log('📊 Loading faculty dashboard data...');

    // Perform startup tests and logging
    await this.weatherLogger.performStartupTests();

    this.loadWeatherData();
    this.startStatsUpdates();
    this.animateCounters();
    this.initializeFacultyData();
    this.loadUserProfileData();
    this.loadQuoteOfTheDay();
    this.loadRandomFact();
    this.loadAnnouncements();

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
    this.announcementSubscriptions.forEach(sub => sub.unsubscribe());
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
    
    // Update DOM elements with the correct SVG paths
    setTimeout(() => {
      this.updateWeatherIconPaths(condition);
    }, 100);
  }

  private updateWeatherIconPaths(condition: string): void {
    const iconElement = document.getElementById('weather-icon');
    const iconElementMobile = document.getElementById('weather-icon-mobile');
    
    if (!iconElement && !iconElementMobile) return;

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

    if (iconElement) {
      iconElement.innerHTML = `<path d="${iconPath}"/>`;
    }
    
    if (iconElementMobile) {
      iconElementMobile.innerHTML = `<path d="${iconPath}"/>`;
    }
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
    this.themeService.toggleDarkMode();
    // Refresh the page to ensure all components update properly
    window.location.reload();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Navigation methods
  onNavigate(view: string): void {
    console.log(`Faculty navigating to ${view}`);

    // Keep sidebar always visible - removed dynamic hiding behavior
    // this.isSidebarHidden = view !== 'dashboard';

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
      timestamp: new Date(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
      timestamp: new Date(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  onProfileClick(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    console.log('Faculty profile clicked - showProfileModal before:', this.showProfileModal);
    this.showProfileModal = !this.showProfileModal;
    if (this.showProfileModal) {
      this.calculateModalPosition();
    }
    console.log('Faculty profile clicked - showProfileModal after:', this.showProfileModal);
  }

  private calculateModalPosition(): void {
    if (this.profileButton && this.profileButton.nativeElement) {
      const buttonRect = this.profileButton.nativeElement.getBoundingClientRect();
      const modalWidth = 192; // 48 * 4 = 192px (w-48 in Tailwind)

      // Position the modal below the button and aligned to its right edge
      this.profileModalTop = `${buttonRect.bottom + 8}px`; // 8px margin below button
      this.profileModalRight = `${window.innerWidth - buttonRect.right}px`; // Align to right edge of button

      console.log('Faculty modal position calculated:', {
        top: this.profileModalTop,
        right: this.profileModalRight,
        buttonRect: buttonRect
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    if (this.showProfileModal) {
      this.calculateModalPosition();
    }
  }

  // Profile modal methods
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  viewProfile(): void {
    this.showProfileModal = false;
    // Navigate to faculty profile page
    this.router.navigate(['/faculty-profile']);
  }

  // Profile photo methods
  loadUserProfileData(): void {
    console.log('🚀 loadUserProfileData() called');
    const currentFaculty = this.facultyAuthService.getCurrentFaculty();
    console.log('🔍 Current faculty from auth service:', currentFaculty);

    if (currentFaculty) {
      // Set basic user info
      this.currentUserName = currentFaculty.fullName || 'Faculty';
      const firstName = currentFaculty.fullName?.split(' ')[0] || 'Faculty';
      this.currentUserInitial = firstName.charAt(0).toUpperCase();

      console.log('👤 Basic faculty info set:', {
        name: this.currentUserName,
        initial: this.currentUserInitial
      });

      // Try to get detailed profile with photo
      this.facultyAuthService.getDetailedProfile().subscribe({
        next: (profile) => {
          console.log('✅ Detailed faculty profile loaded:', profile);

          if (profile?.profilePhoto) {
            console.log('📸 Profile photo found:', profile.profilePhoto);
            this.currentUserProfilePhoto = profile.profilePhoto;
          } else {
            console.log('📸 No profile photo found, using default');
            this.currentUserProfilePhoto = '';
          }

          // Update name from detailed profile if available
          if (profile?.firstName) {
            const fullName = `${profile.firstName} ${profile.lastName || ''}`.trim();
            this.currentUserName = fullName;
            this.currentUserInitial = profile.firstName.charAt(0).toUpperCase();
            console.log('👤 Updated faculty info from detailed profile:', {
              name: this.currentUserName,
              initial: this.currentUserInitial,
              photo: this.currentUserProfilePhoto
            });
          }
        },
        error: (error) => {
          console.error('❌ Error loading detailed profile:', error);
          // Fallback to basic faculty data
          const firstName = currentFaculty.fullName?.split(' ')[0] || 'Faculty';
          this.currentUserInitial = firstName.charAt(0).toUpperCase();
          console.log('🔄 Fallback: Using initial from basic faculty data:', this.currentUserInitial);
        }
      });
    } else {
      console.log('❌ No current faculty found');
    }
  }

  hasValidProfilePhoto(): boolean {
    const photoUrl = this.currentUserProfilePhoto;
    return Boolean(photoUrl &&
                   photoUrl.trim() !== '' &&
                   !photoUrl.includes('data:image/svg+xml') && // Not the default SVG
                   (photoUrl.startsWith('http://') || photoUrl.startsWith('https://') || photoUrl.startsWith('/')));
  }

  getProfileImageSrc(): string {
    // Return uploaded photo if available and valid, otherwise return default SVG
    if (this.hasValidProfilePhoto()) {
      let imageUrl = this.currentUserProfilePhoto;

      // Convert relative URLs to full backend URLs
      if (imageUrl.startsWith('/api/')) {
        imageUrl = `http://localhost:3000${imageUrl}`;
      }

      return imageUrl;
    }

    // Return default faculty avatar with initial
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#3B82F6"/>
        <text x="16" y="22" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">${this.currentUserInitial}</text>
      </svg>
    `)}`;
  }

  onImageError(event: any): void {
    console.log('🖼️ Faculty image load error, falling back to default');
    event.target.src = `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <rect width="32" height="32" fill="#3B82F6"/>
        <text x="16" y="22" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">${this.currentUserInitial}</text>
      </svg>
    `)}`;
  }

  onImageLoad(event: any): void {
    console.log('🖼️ Faculty profile image loaded successfully');
  }

  onAvatarError(event: any): void {
    console.log('🖼️ BC-AI avatar image load error, using fallback');
    this.avatarError = true;
    // The template will show the fallback SVG icon when avatarError is true
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

  // Date methods
  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Quote of the Day methods
  private loadQuoteOfTheDay(): void {
    console.log('🎯 === LOADING FACULTY QUOTE OF THE DAY ===');
    this.isQuoteLoading = true;
    this.quoteError = null;

    // Fetch quote with faculty-specific categories
    this.fetchFacultyQuote().subscribe({
      next: (response: any) => {
        console.log('🔍 Faculty quote response:', response);
        if (response && (response.quote || response.text)) {
          this.currentQuote = {
            text: response.quote || response.text || 'No quote available',
            author: response.author || 'Unknown Author'
          };
          this.quoteError = null;
          console.log('✅ Faculty quote loaded successfully:', this.currentQuote);
        } else {
          this.quoteError = 'Failed to load quote';
          console.log('❌ Faculty quote loading failed:', this.quoteError);
        }
        this.isQuoteLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Error loading faculty quote:', error);
        this.quoteError = 'Failed to load quote of the day';
        this.isQuoteLoading = false;
        
        // Fallback quote for faculty
        this.currentQuote = {
          text: "The best teachers are those who show you where to look but don't tell you what to see.",
          author: "Anonymous"
        };
      }
    });
  }

  private fetchFacultyQuote() {
    // Faculty-specific categories: teacher, motivation, inspiration, education
    const categories = ['teacher', 'motivation', 'inspiration', 'education'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const url = `https://benedictocollege-quote-api.netlify.app/.netlify/functions/random?category=${randomCategory}`;
    
    console.log('🌐 Making faculty quote API request to:', url);
    return this.http.get(url);
  }

  private loadRandomFact(): void {
    this.http.get<any>('https://uselessfacts.jsph.pl/api/v2/facts/random').subscribe({
      next: (data) => {
        this.randomFact = data.text;
      },
      error: (error) => {
        this.factError = 'Failed to load a fact. Please try again later.';
        this.randomFact = 'Could not fetch a fact at this time.';
        console.error('Error fetching random fact:', error);
      }
    });
  }

  // Greeting methods
  getGreeting(): string {
    const currentFaculty = this.facultyAuthService.getCurrentFaculty();
    const firstName = currentFaculty?.firstName || currentFaculty?.fullName?.split(' ')[0] || 'Faculty';

    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) {
      timeGreeting = 'Good Morning';
    } else if (hour < 17) {
      timeGreeting = 'Good Afternoon';
    } else {
      timeGreeting = 'Good Evening';
    }

    return `${timeGreeting}, ${firstName}!`;
  }

  getMobileGreeting(): string {
    const currentFaculty = this.facultyAuthService.getCurrentFaculty();
    const firstName = currentFaculty?.firstName || currentFaculty?.fullName?.split(' ')[0] || 'Faculty';

    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour < 12) {
      timeGreeting = 'Morning';
    } else if (hour < 17) {
      timeGreeting = 'Afternoon';
    } else {
      timeGreeting = 'Evening';
    }

    return `Good ${timeGreeting}, ${firstName}!`;
  }

  // Announcement loading methods
  private loadAnnouncements(): void {
    // Load announcements for faculty
    const announcementSub = this.announcementService.getAnnouncementsByAudience('faculty').subscribe(announcements => {
      this.announcements = announcements;
    });
    this.announcementSubscriptions.push(announcementSub);

    // Load news items
    const newsSub = this.announcementService.getActiveNews().subscribe(news => {
      this.latestNews = news;
    });
    this.announcementSubscriptions.push(newsSub);
  }

  // Utility methods for announcements
  getTimeAgo(dateString: string): string {
    return this.announcementService.getTimeAgo(dateString);
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error': return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-blue-500';
    }
  }

  getNewsColor(color: string): string {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  }
}