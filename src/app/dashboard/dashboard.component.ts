import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

interface WeatherData {
  main: {
    temp: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

interface LibraryStats {
  books: number;
  members: number;
  activeToday: number;
}

interface ChatMessage {
  text: string;
  isUser: boolean;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  private weatherSubscription?: Subscription;
  private statsSubscription?: Subscription;

  // Dark mode and mobile menu state
  isDarkMode: boolean = false;
  isMobileMenuOpen: boolean = false;

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadWeatherData();
    this.startStatsUpdates();
    this.animateCounters();
    this.loadDarkModePreference();

    // Update weather every 10 minutes
    this.weatherSubscription = interval(600000).subscribe(() => {
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
    // OpenWeatherMap API key - replace with your actual API key
    const apiKey = 'your_openweathermap_api_key';
    const city = 'Cebu City,PH';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // For demo purposes, we'll simulate the API call
    // In production, uncomment the HTTP call below and add your API key

    /*
    this.http.get<WeatherData>(url).subscribe({
      next: (data) => {
        this.temperature = `${Math.round(data.main.temp)}°C`;
        this.location = data.name;
        this.updateWeatherIcon(data.weather[0].main);
      },
      error: (error) => {
        console.error('Weather API error:', error);
        // Fallback to default values
        this.temperature = '31°C';
        this.location = 'Cebu City';
      }
    });
    */

    // Simulate weather data for demo
    this.simulateWeatherData();
  }

  private simulateWeatherData(): void {
    const temps = [29, 30, 31, 32, 33];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    this.temperature = `${randomTemp}°C`;
    this.location = 'Cebu City';

    // Update DOM elements
    setTimeout(() => {
      const tempElement = document.getElementById('temperature');
      const locationElement = document.getElementById('location');

      if (tempElement) tempElement.textContent = this.temperature;
      if (locationElement) locationElement.textContent = this.location;
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

    // Update DOM elements
    setTimeout(() => {
      const booksElement = document.getElementById('books-count');
      const membersElement = document.getElementById('members-count');
      const activeElement = document.getElementById('active-count');

      if (booksElement) booksElement.textContent = this.stats.books.toLocaleString();
      if (membersElement) membersElement.textContent = this.stats.members.toLocaleString();
      if (activeElement) activeElement.textContent = this.stats.activeToday.toString();
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
    if (confirm('Are you sure you want to logout?')) {
      // Implement logout logic here
      console.log('Logging out...');
      // Redirect to login page or clear session
    }
  }

  onNavigate(section: string): void {
    console.log(`Navigating to ${section}`);
    // Implement navigation logic here
    // You can use Angular Router to navigate to different sections
  }

  // Notification methods
  onNotificationClick(): void {
    console.log('Notifications clicked');
    // Implement notification panel toggle
  }

  onProfileClick(): void {
    console.log('Profile clicked');
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

    // Simple keyword-based responses
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
}