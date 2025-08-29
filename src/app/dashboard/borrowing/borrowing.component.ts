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

interface Loan {
  id: string;
  student: Student;
  book: Book;
  loanDate: string;
  dueDate: string;
  status: 'Active' | 'Overdue' | 'Due Today';
}

interface BorrowingStats {
  activeLoans: number;
  returnsToday: number;
  overdueItems: number;
  dueToday: number;
}

@Component({
  selector: 'app-borrowing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borrowing.component.html',
  styleUrls: ['./borrowing.component.css']
})
export class BorrowingComponent implements OnInit {

  stats: BorrowingStats = {
    activeLoans: 234,
    returnsToday: 18,
    overdueItems: 12,
    dueToday: 8
  };

  // All loans data
  loans: Loan[] = [
    {
      id: 'L001',
      student: { id: 'S2024001', name: 'Maria Santos' },
      book: { title: 'Introduction to Computer Science', author: 'John Smith' },
      loanDate: '2024-07-15',
      dueDate: '2024-07-29',
      status: 'Active'
    },
    {
      id: 'L002',
      student: { id: 'S2024002', name: 'Juan Dela Cruz' },
      book: { title: 'Advanced Mathematics', author: 'Dr. Johnson' },
      loanDate: '2024-07-10',
      dueDate: '2024-07-24',
      status: 'Overdue'
    },
    {
      id: 'L003',
      student: { id: 'S2024003', name: 'Ana Rodriguez' },
      book: { title: 'Philippine History', author: 'Prof. Garcia' },
      loanDate: '2024-07-20',
      dueDate: '2024-07-27',
      status: 'Due Today'
    },
    {
      id: 'L004',
      student: { id: 'S2024004', name: 'Carlos Mendoza' },
      book: { title: 'English Literature', author: 'Shakespeare' },
      loanDate: '2024-07-18',
      dueDate: '2024-08-01',
      status: 'Active'
    },
    {
      id: 'L005',
      student: { id: 'S2024005', name: 'Lisa Chen' },
      book: { title: 'Biology Fundamentals', author: 'Dr. Wilson' },
      loanDate: '2024-07-12',
      dueDate: '2024-07-26',
      status: 'Overdue'
    },
    {
      id: 'L006',
      student: { id: 'S2024006', name: 'Roberto Aquino' },
      book: { title: 'Physics for Engineers', author: 'Dr. Rodriguez' },
      loanDate: '2024-07-22',
      dueDate: '2024-08-05',
      status: 'Active'
    },
    {
      id: 'L007',
      student: { id: 'S2024007', name: 'Elena Villanueva' },
      book: { title: 'Artificial Intelligence', author: 'Stuart Russell' },
      loanDate: '2024-07-05',
      dueDate: '2024-07-19',
      status: 'Overdue'
    },
    {
      id: 'L008',
      student: { id: 'S2024008', name: 'David Lim' },
      book: { title: 'Database Systems', author: 'Abraham Silberschatz' },
      loanDate: '2024-07-25',
      dueDate: '2024-08-08',
      status: 'Active'
    },
    {
      id: 'L009',
      student: { id: 'S2024009', name: 'Catherine Ong' },
      book: { title: 'Web Development', author: 'Jon Duckett' },
      loanDate: '2024-07-17',
      dueDate: '2024-07-31',
      status: 'Active'
    },
    {
      id: 'L010',
      student: { id: 'S2024010', name: 'Rafael Tan' },
      book: { title: 'Machine Learning', author: 'Tom Mitchell' },
      loanDate: '2024-07-08',
      dueDate: '2024-07-22',
      status: 'Overdue'
    },
    {
      id: 'L011',
      student: { id: 'S2024011', name: 'Isabel Cruz' },
      book: { title: 'Software Engineering', author: 'Ian Sommerville' },
      loanDate: '2024-07-24',
      dueDate: '2024-07-27',
      status: 'Due Today'
    },
    {
      id: 'L012',
      student: { id: 'S2024012', name: 'Michael Wong' },
      book: { title: 'Computer Networks', author: 'Andrew Tanenbaum' },
      loanDate: '2024-07-19',
      dueDate: '2024-08-02',
      status: 'Active'
    }
  ];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalLoans: number = 0;
  
  // Filter properties
  selectedStatus: string = '';
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
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      case 'Due Today':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Apply filters and sorting
  private applyFiltersAndSort(): void {
    let filtered = [...this.loans];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.student.name.toLowerCase().includes(term) ||
        loan.book.title.toLowerCase().includes(term) ||
        loan.book.author.toLowerCase().includes(term) ||
        loan.id.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(loan => loan.status === this.selectedStatus);
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
        case 'loanDate':
          aValue = new Date(a.loanDate).getTime();
          bValue = new Date(b.loanDate).getTime();
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate).getTime();
          bValue = new Date(b.dueDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.loans = filtered;
    this.updatePagination();
  }
  
  // Update pagination
  private updatePagination(): void {
    this.totalLoans = this.loans.length;
    this.totalPages = Math.ceil(this.totalLoans / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }
  
  // Get loans for current page
  getPaginatedLoans(): Loan[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.loans.slice(startIndex, endIndex);
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
    if (this.totalLoans === 0) return '0 - 0 of 0';

    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalLoans);

    return `${start} - ${end} of ${this.totalLoans}`;
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
