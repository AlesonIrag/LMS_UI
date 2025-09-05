import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';

interface Student {
  id: string;
  name: string;
}

interface Book {
  title: string;
  author: string;
}

interface Reservation {
  id: string;
  student: Student;
  book: Book;
  reservedDate: string;
  holdUntil: string;
  priority: 'High' | 'Normal' | 'Low';
  status: 'Pending' | 'Ready' | 'Expired' | 'Fulfilled';
}

interface ReservationStats {
  activeReservations: number;
  readyForPickup: number;
  expiredHolds: number;
  fulfilledToday: number;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  stats: ReservationStats = {
    activeReservations: 45,
    readyForPickup: 12,
    expiredHolds: 3,
    fulfilledToday: 8
  };

  // All reservations data
  reservations: Reservation[] = [
    {
      id: 'R001',
      student: { id: 'S2024001', name: 'Sofia Martinez' },
      book: { title: 'Data Structures and Algorithms', author: 'Thomas Cormen' },
      reservedDate: '2024-07-20',
      holdUntil: '2024-07-30',
      priority: 'High',
      status: 'Ready'
    },
    {
      id: 'R002',
      student: { id: 'S2024002', name: 'Miguel Torres' },
      book: { title: 'Organic Chemistry', author: 'Paula Bruice' },
      reservedDate: '2024-07-18',
      holdUntil: '2024-07-28',
      priority: 'Normal',
      status: 'Pending'
    },
    {
      id: 'R003',
      student: { id: 'S2024003', name: 'Isabella Garcia' },
      book: { title: 'World Literature', author: 'Various Authors' },
      reservedDate: '2024-07-15',
      holdUntil: '2024-07-25',
      priority: 'Low',
      status: 'Expired'
    },
    {
      id: 'R004',
      student: { id: 'S2024004', name: 'Diego Fernandez' },
      book: { title: 'Calculus: Early Transcendentals', author: 'James Stewart' },
      reservedDate: '2024-07-22',
      holdUntil: '2024-08-01',
      priority: 'High',
      status: 'Ready'
    },
    {
      id: 'R005',
      student: { id: 'S2024005', name: 'Carmen Reyes' },
      book: { title: 'Introduction to Psychology', author: 'David Myers' },
      reservedDate: '2024-07-19',
      holdUntil: '2024-07-29',
      priority: 'Normal',
      status: 'Pending'
    },
    {
      id: 'R006',
      student: { id: 'S2024006', name: 'Antonio Rivera' },
      book: { title: 'Operating Systems', author: 'Abraham Silberschatz' },
      reservedDate: '2024-07-23',
      holdUntil: '2024-08-02',
      priority: 'High',
      status: 'Pending'
    },
    {
      id: 'R007',
      student: { id: 'S2024007', name: 'Elena Morales' },
      book: { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell' },
      reservedDate: '2024-07-17',
      holdUntil: '2024-07-27',
      priority: 'High',
      status: 'Ready'
    },
    {
      id: 'R008',
      student: { id: 'S2024008', name: 'Ricardo Santos' },
      book: { title: 'Database System Concepts', author: 'Abraham Silberschatz' },
      reservedDate: '2024-07-21',
      holdUntil: '2024-07-31',
      priority: 'Normal',
      status: 'Pending'
    },
    {
      id: 'R009',
      student: { id: 'S2024009', name: 'Patricia Gomez' },
      book: { title: 'Computer Networking', author: 'Kurose & Ross' },
      reservedDate: '2024-07-16',
      holdUntil: '2024-07-26',
      priority: 'Low',
      status: 'Expired'
    },
    {
      id: 'R010',
      student: { id: 'S2024010', name: 'Javier Hernandez' },
      book: { title: 'Software Engineering', author: 'Ian Sommerville' },
      reservedDate: '2024-07-24',
      holdUntil: '2024-08-03',
      priority: 'High',
      status: 'Pending'
    },
    {
      id: 'R011',
      student: { id: 'S2024011', name: 'Monica Delgado' },
      book: { title: 'Machine Learning', author: 'Tom Mitchell' },
      reservedDate: '2024-07-22',
      holdUntil: '2024-08-01',
      priority: 'Normal',
      status: 'Ready'
    },
    {
      id: 'R012',
      student: { id: 'S2024012', name: 'Carlos Espinoza' },
      book: { title: 'Web Development with React', author: 'Robin Wieruch' },
      reservedDate: '2024-07-19',
      holdUntil: '2024-07-29',
      priority: 'Normal',
      status: 'Pending'
    },
    {
      id: 'R013',
      student: { id: 'S2024013', name: 'Andrea Castro' },
      book: { title: 'Cybersecurity Basics', author: 'Chuck Easttom' },
      reservedDate: '2024-07-14',
      holdUntil: '2024-07-24',
      priority: 'Low',
      status: 'Expired'
    },
    {
      id: 'R014',
      student: { id: 'S2024014', name: 'Luis Navarro' },
      book: { title: 'Mobile App Development', author: 'Jakob Jenkov' },
      reservedDate: '2024-07-25',
      holdUntil: '2024-08-04',
      priority: 'High',
      status: 'Pending'
    },
    {
      id: 'R015',
      student: { id: 'S2024015', name: 'Gabriela Flores' },
      book: { title: 'Cloud Computing', author: 'Barrie Sosinsky' },
      reservedDate: '2024-07-23',
      holdUntil: '2024-08-02',
      priority: 'Normal',
      status: 'Ready'
    }
  ];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalReservations: number = 0;
  
  // Filter properties
  selectedStatus: string = '';
  selectedPriority: string = '';
  searchTerm: string = '';
  
  // Sorting properties
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private themeService: ThemeService) { }

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  ngOnInit(): void {
    this.applyFiltersAndSort();
  }

  getTextClasses(): string {
    return this.isDarkMode ? 'text-white' : 'text-gray-900';
  }

  getSecondaryTextClasses(): string {
    return this.isDarkMode ? 'text-gray-400' : 'text-gray-600';
  }

  getCardClasses(): string {
    return this.isDarkMode 
      ? 'bg-gray-800 border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-900';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ready':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      case 'Fulfilled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Apply filters and sorting
  private applyFiltersAndSort(): void {
    let filtered = [...this.reservations];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(reservation =>
        reservation.student.name.toLowerCase().includes(term) ||
        reservation.book.title.toLowerCase().includes(term) ||
        reservation.book.author.toLowerCase().includes(term) ||
        reservation.id.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(reservation => reservation.status === this.selectedStatus);
    }

    // Apply priority filter
    if (this.selectedPriority) {
      filtered = filtered.filter(reservation => reservation.priority === this.selectedPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'student':
          aValue = a.student.name.toLowerCase();
          bValue = b.student.name.toLowerCase();
          break;
        case 'book':
          aValue = a.book.title.toLowerCase();
          bValue = b.book.title.toLowerCase();
          break;
        case 'reservedDate':
          aValue = new Date(a.reservedDate).getTime();
          bValue = new Date(b.reservedDate).getTime();
          break;
        case 'holdUntil':
          aValue = new Date(a.holdUntil).getTime();
          bValue = new Date(b.holdUntil).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          aValue = a.priority;
          bValue = b.priority;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.reservations = filtered;
    this.updatePagination();
  }
  
  // Update pagination
  private updatePagination(): void {
    this.totalReservations = this.reservations.length;
    this.totalPages = Math.ceil(this.totalReservations / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }
  
  // Get reservations for current page
  getPaginatedReservations(): Reservation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.reservations.slice(startIndex, endIndex);
  }
  
  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  getDisplayRange(): string {
    if (this.totalReservations === 0) return '0 - 0 of 0';

    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalReservations);

    return `${start} - ${end} of ${this.totalReservations}`;
  }

  onItemsPerPageChange(): void {
    // Reset to first page when changing items per page
    this.currentPage = 1;
    this.updatePagination();
  }
  
  // Filter change handler
  onFilterChange(): void {
    this.applyFiltersAndSort();
  }
  
  // Search functionality
  onSearch(): void {
    this.applyFiltersAndSort();
  }
  
  // Sort functionality
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFiltersAndSort();
  }
}
