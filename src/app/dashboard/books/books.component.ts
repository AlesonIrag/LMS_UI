import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { CsvService } from '../../services/csv.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../../components/toast/toast.component';

interface Book {
  BookID?: number;
  Title: string;
  Author: string;
  ISBN: string;
  Category: string;
  Subject: string;
  PublishedYear?: number;
  CopyrightYear?: number;
  Publisher: string;
  CallNumber: string;
  DeweyDecimal: string;
  Copies: number;
  Remarks?: string;
  Status: 'Available' | 'Borrowed' | 'Lost' | 'Damaged';
  ShelfLocation: string;
  AcquisitionDate?: string;
}

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  showAddBookModal: boolean = false;
  showViewBookModal: boolean = false;
  showEditBookModal: boolean = false;
  showDeleteConfirmModal: boolean = false;
  showBookSummaryModal: boolean = false;
  showImportCsvModal: boolean = false;
  isSubmitting: boolean = false;

  // CSV related properties
  csvFile: File | null = null;
  csvData: any[] = [];
  csvValidationResults: { valid: any[], invalid: any[] } = { valid: [], invalid: [] };
  csvImportStep: 'upload' | 'validate' | 'import' = 'upload';
  csvImportProgress: number = 0;

  // Notification system
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  // Selected book for view/edit/delete operations
  selectedBook: Book | null = null;

  newBook: Book = {
    Title: '',
    Author: '',
    ISBN: '',
    Category: '',
    Subject: '',
    PublishedYear: undefined,
    CopyrightYear: undefined,
    Publisher: '',
    CallNumber: '',
    DeweyDecimal: '',
    Copies: 1,
    Remarks: '',
    Status: 'Available',
    ShelfLocation: '',
    AcquisitionDate: ''
  };

  editBookData: Book = {
    Title: '',
    Author: '',
    ISBN: '',
    Category: '',
    Subject: '',
    PublishedYear: undefined,
    CopyrightYear: undefined,
    Publisher: '',
    CallNumber: '',
    DeweyDecimal: '',
    Copies: 1,
    Remarks: '',
    Status: 'Available',
    ShelfLocation: '',
    AcquisitionDate: ''
  };

  books: Book[] = [];
  allBooks: Book[] = [];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10; // Increased from 5 to 10 books per page
  totalPages: number = 0;
  totalBooks: number = 0;

  constructor(
    private apiService: ApiService,
    private themeService: ThemeService,
    private csvService: CsvService,
    private toastService: ToastService
  ) { }

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  ngOnInit(): void {
    // Load books from API
    this.loadBooks();
  }

  loadBooks(): void {
    // Build query parameters for pagination
    const params = `?page=${this.currentPage}&limit=${this.itemsPerPage}`;

    this.apiService.get(`/books/get-all-books${params}`).subscribe({
      next: (response: any) => {
        console.log('📥 API Response:', response);
        if (response.success) {
          this.books = response.books || [];
          this.allBooks = response.books || []; // Keep for compatibility with existing methods

          // Use pagination info from server
          if (response.pagination) {
            this.totalBooks = response.pagination.totalBooks;
            this.totalPages = response.pagination.totalPages;
            this.currentPage = response.pagination.currentPage;
          } else {
            // Fallback for backward compatibility
            this.totalBooks = this.books.length;
            this.totalPages = Math.ceil(this.totalBooks / this.itemsPerPage);
          }

          console.log('✅ Books loaded:', this.books.length, 'books for page', this.currentPage);
          console.log('📊 Pagination Info:', {
            totalBooks: this.totalBooks,
            itemsPerPage: this.itemsPerPage,
            totalPages: this.totalPages,
            currentPage: this.currentPage
          });
        }
      },
      error: (error) => {
        console.error('❌ Error loading books:', error);
        // Keep books array empty if API fails
        this.allBooks = [];
        this.books = [];
        this.totalBooks = 0;
        this.totalPages = 0;
      }
    });
  }

  updateDisplayedBooks(): void {
    // No longer needed since we're using server-side pagination
    // The books array is already the correct page from the server
    console.log('📄 updateDisplayedBooks called - using server-side pagination');
  }

  openAddBookModal(): void {
    this.showAddBookModal = true;
    this.resetNewBook();
  }

  closeAddBookModal(): void {
    this.showAddBookModal = false;
    this.resetNewBook();
  }

  resetNewBook(): void {
    this.newBook = {
      Title: '',
      Author: '',
      ISBN: '',
      Category: '',
      Subject: '',
      PublishedYear: undefined,
      CopyrightYear: undefined,
      Publisher: '',
      CallNumber: '',
      DeweyDecimal: '',
      Copies: 1,
      Remarks: '',
      Status: 'Available',
      ShelfLocation: '',
      AcquisitionDate: ''
    };
  }

  onSubmitBook(): void {
    if (this.isSubmitting) return;

    // Validate required fields
    if (!this.newBook.Title || !this.newBook.ISBN) {
      this.isSubmitting = true; // Set to true to show validation errors
      setTimeout(() => {
        this.isSubmitting = false; // Reset after showing errors
      }, 100);
      return;
    }

    this.isSubmitting = true;

    // Prepare the book data for API (using PascalCase as expected by backend)
    const bookData = {
      Title: this.newBook.Title,
      Author: this.newBook.Author || null,
      ISBN: this.newBook.ISBN,
      Category: this.newBook.Category || null,
      Subject: this.newBook.Subject || null,
      PublishedYear: this.newBook.PublishedYear || null,
      CopyrightYear: this.newBook.CopyrightYear || null,
      Publisher: this.newBook.Publisher || null,
      CallNumber: this.newBook.CallNumber || null,
      DeweyDecimal: this.newBook.DeweyDecimal || null,
      Copies: this.newBook.Copies || 1,
      Remarks: this.newBook.Remarks || null,
      Status: this.newBook.Status,
      ShelfLocation: this.newBook.ShelfLocation || null,
      AcquisitionDate: this.newBook.AcquisitionDate || null
    };

    console.log('📤 Sending book data to API:', bookData);

    // Call API to add book
    this.apiService.post('/books/add-book', bookData).subscribe({
      next: (response: any) => {
        console.log('✅ Book added successfully:', response);
        this.isSubmitting = false;
        this.closeAddBookModal();
        // Refresh books list to show the new book
        this.loadBooks();
        this.showNotificationMessage('Book added successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error adding book:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.isSubmitting = false;

        // Handle different types of errors
        let errorMessage = 'Error adding book. Please try again.';

        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && error.error.details && error.error.details.length > 0) {
          errorMessage = error.error.details[0].msg;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showNotificationMessage(errorMessage, 'error');
      }
    });
  }

  addNewBook(): void {
    this.openAddBookModal();
  }

  // Refresh books data
  refreshBooks(): void {
    console.log('🔄 Refreshing books data...');
    this.loadBooks();
  }

  viewBook(bookId: number | undefined): void {
    if (bookId) {
      const book = this.books.find(b => b.BookID === bookId);
      if (book) {
        this.selectedBook = book;
        this.showViewBookModal = true;
      }
    }
  }

  editBook(bookId: number | undefined): void {
    if (bookId) {
      const book = this.books.find(b => b.BookID === bookId);
      if (book) {
        this.selectedBook = book;
        // Copy book data to editBookData for editing
        this.editBookData = { ...book };
        this.showEditBookModal = true;
      }
    }
  }

  deleteBook(bookId: number | undefined): void {
    if (bookId) {
      const book = this.books.find(b => b.BookID === bookId);
      if (book) {
        this.selectedBook = book;
        this.showDeleteConfirmModal = true;
      }
    }
  }

  // Notification methods
  showNotificationMessage(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification(): void {
    this.showNotification = false;
    this.notificationMessage = '';
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBooks(); // Reload data from server for the new page
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks(); // Reload data from server for the previous page
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks(); // Reload data from server for the next page
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
    if (this.totalBooks === 0) return '0 - 0 of 0';

    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.totalBooks);

    return `${start} - ${end} of ${this.totalBooks}`;
  }

  onItemsPerPageChange(): void {
    // Reset to first page when changing items per page
    this.currentPage = 1;
    // Reload data from server with new page size
    this.loadBooks();
    console.log('📄 Items per page changed to:', this.itemsPerPage);
  }

  addTestBooks(): void {
    const testBooks = [
      {
        Title: 'Introduction to Computer Science',
        Author: 'John Smith',
        ISBN: '978-0123456789',
        Category: 'Computer Science',
        Subject: 'Programming',
        PublishedYear: 2023,
        CopyrightYear: 2023,
        Publisher: 'Tech Books Publishing',
        CallNumber: 'CS101',
        DeweyDecimal: '004.1',
        Copies: 5,
        Remarks: 'Latest edition with updated content',
        Status: 'Available',
        ShelfLocation: 'A-1-001',
        AcquisitionDate: '2024-01-15'
      },
      {
        Title: 'Advanced Mathematics',
        Author: 'Jane Doe',
        ISBN: '978-0987654321',
        Category: 'Mathematics',
        Subject: 'Calculus',
        PublishedYear: 2022,
        CopyrightYear: 2022,
        Publisher: 'Academic Press',
        CallNumber: 'MATH201',
        DeweyDecimal: '515.1',
        Copies: 3,
        Remarks: 'Comprehensive calculus textbook',
        Status: 'Available',
        ShelfLocation: 'B-2-015',
        AcquisitionDate: '2024-01-20'
      },
      {
        Title: 'World History Encyclopedia',
        Author: 'Robert Johnson',
        ISBN: '978-0456789123',
        Category: 'History',
        Subject: 'World History',
        PublishedYear: 2021,
        CopyrightYear: 2021,
        Publisher: 'Historical Publications',
        CallNumber: 'HIST301',
        DeweyDecimal: '909.1',
        Copies: 2,
        Remarks: 'Complete world history reference',
        Status: 'Available',
        ShelfLocation: 'C-3-025',
        AcquisitionDate: '2024-02-01'
      }
    ];

    // Add each test book
    let addedCount = 0;
    testBooks.forEach((book, index) => {
      setTimeout(() => {
        this.apiService.post('/books/add-book', book).subscribe({
          next: (response: any) => {
            addedCount++;
            console.log(`✅ Test book ${addedCount} added:`, book.Title);
            if (addedCount === testBooks.length) {
              // Refresh the books list after all test books are added
              this.loadBooks();
              this.showNotificationMessage(`${testBooks.length} test books added successfully!`, 'success');
            }
          },
          error: (error) => {
            console.error('❌ Error adding test book:', error);
          }
        });
      }, index * 500); // Stagger the requests by 500ms each
    });
  }

  // Modal control methods
  closeViewBookModal(): void {
    this.showViewBookModal = false;
    this.selectedBook = null;
  }

  closeEditBookModal(): void {
    this.showEditBookModal = false;
    this.selectedBook = null;
    this.resetEditBook();
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.selectedBook = null;
  }

  // Book Summary modal methods
  openBookSummaryModal(): void {
    this.showBookSummaryModal = true;
  }

  closeBookSummaryModal(): void {
    this.showBookSummaryModal = false;
  }

  // Get book statistics for summary
  getBookStats() {
    const totalBooks = this.totalBooks;
    const availableBooks = this.books.filter(book => book.Status === 'Available').length;
    const borrowedBooks = this.books.filter(book => book.Status === 'Borrowed').length;
    const lostBooks = this.books.filter(book => book.Status === 'Lost').length;
    const damagedBooks = this.books.filter(book => book.Status === 'Damaged').length;

    // Get category distribution
    const categoryStats = this.books.reduce((acc: any, book) => {
      const category = book.Category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalBooks,
      availableBooks,
      borrowedBooks,
      lostBooks,
      damagedBooks,
      categoryStats
    };
  }

  // Helper method to access Object.keys in template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  resetEditBook(): void {
    this.editBookData = {
      Title: '',
      Author: '',
      ISBN: '',
      Category: '',
      Subject: '',
      PublishedYear: undefined,
      CopyrightYear: undefined,
      Publisher: '',
      CallNumber: '',
      DeweyDecimal: '',
      Copies: 1,
      Remarks: '',
      Status: 'Available',
      ShelfLocation: '',
      AcquisitionDate: ''
    };
  }

  // Update book method
  onUpdateBook(): void {
    console.log('🔄 onUpdateBook called');
    console.log('📋 isSubmitting:', this.isSubmitting);
    console.log('📋 selectedBook:', this.selectedBook);
    console.log('📋 editBookData:', this.editBookData);

    if (this.isSubmitting || !this.selectedBook) {
      console.log('❌ Early return - isSubmitting or no selectedBook');
      return;
    }

    // Validate required fields
    if (!this.editBookData.Title || !this.editBookData.ISBN) {
      console.log('❌ Validation failed - missing Title or ISBN');
      console.log('📋 Title:', this.editBookData.Title);
      console.log('📋 ISBN:', this.editBookData.ISBN);
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
      }, 100);
      return;
    }

    console.log('✅ Validation passed, proceeding with update');
    this.isSubmitting = true;

    // Prepare the book data for API (using PascalCase as expected by backend)
    const bookData = {
      Title: this.editBookData.Title,
      Author: this.editBookData.Author || null,
      ISBN: this.editBookData.ISBN,
      Category: this.editBookData.Category || null,
      Subject: this.editBookData.Subject || null,
      PublishedYear: this.editBookData.PublishedYear || null,
      CopyrightYear: this.editBookData.CopyrightYear || null,
      Publisher: this.editBookData.Publisher || null,
      CallNumber: this.editBookData.CallNumber || null,
      DeweyDecimal: this.editBookData.DeweyDecimal || null,
      Copies: this.editBookData.Copies || 1,
      Remarks: this.editBookData.Remarks || null,
      Status: this.editBookData.Status,
      ShelfLocation: this.editBookData.ShelfLocation || null,
      AcquisitionDate: this.editBookData.AcquisitionDate || null
    };

    console.log('📤 Updating book data:', bookData);
    console.log('📤 API endpoint:', `/books/update-book/${this.selectedBook.BookID}`);

    // Call API to update book
    this.apiService.put(`/books/update-book/${this.selectedBook.BookID}`, bookData).subscribe({
      next: (response: any) => {
        console.log('✅ Book updated successfully:', response);
        this.isSubmitting = false;
        this.closeEditBookModal();
        // Refresh books list to show the updated book
        this.loadBooks();
        this.showNotificationMessage('Book updated successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error updating book:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        this.isSubmitting = false;

        // Handle different types of errors
        let errorMessage = 'Error updating book. Please try again.';

        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && error.error.details && error.error.details.length > 0) {
          errorMessage = error.error.details[0].msg;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showNotificationMessage(errorMessage, 'error');
      }
    });
  }

  // Confirm delete method
  confirmDelete(): void {
    if (this.isSubmitting || !this.selectedBook) return;

    this.isSubmitting = true;

    console.log('🗑️ Deleting book:', this.selectedBook.BookID);

    // Call API to delete book
    this.apiService.delete(`/books/delete-book/${this.selectedBook.BookID}`).subscribe({
      next: (response: any) => {
        console.log('✅ Book deleted successfully:', response);
        this.isSubmitting = false;
        this.closeDeleteConfirmModal();
        // Refresh books list to remove the deleted book
        this.loadBooks();
        this.showNotificationMessage('Book deleted successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error deleting book:', error);
        this.isSubmitting = false;

        // Handle different types of errors
        let errorMessage = 'Error deleting book. Please try again.';

        if (error.status === 0) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.showNotificationMessage(errorMessage, 'error');
      }
    });
  }

  // CSV Import/Export Methods
  openImportCsvModal(): void {
    this.showImportCsvModal = true;
    this.csvImportStep = 'upload';
    this.csvFile = null;
    this.csvData = [];
    this.csvValidationResults = { valid: [], invalid: [] };
  }

  closeImportCsvModal(): void {
    this.showImportCsvModal = false;
    this.csvImportStep = 'upload';
    this.csvFile = null;
    this.csvData = [];
    this.csvValidationResults = { valid: [], invalid: [] };
  }

  onCsvFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.csvFile = file;
      this.readCsvFile();
    } else {
      this.toastService.error('Please select a valid CSV file');
    }
  }

  private readCsvFile(): void {
    if (!this.csvFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const headers = ['Title', 'Author', 'ISBN', 'Category', 'Subject', 'PublishedYear', 'CopyrightYear', 'Publisher', 'CallNumber', 'DeweyDecimal', 'Copies', 'Remarks', 'Status', 'ShelfLocation', 'AcquisitionDate'];

      this.csvData = this.csvService.parseCsv(csvContent, headers);
      this.csvValidationResults = this.csvService.validateBookData(this.csvData);
      this.csvImportStep = 'validate';
    };
    reader.readAsText(this.csvFile);
  }

  importValidBooks(): void {
    if (this.csvValidationResults.valid.length === 0) {
      this.toastService.error('No valid books to import');
      return;
    }

    this.isSubmitting = true;
    this.csvImportProgress = 0;
    const validBooks = this.csvValidationResults.valid;
    let importedCount = 0;
    let errorCount = 0;

    // Import books one by one with progress tracking
    const importNext = (index: number) => {
      if (index >= validBooks.length) {
        this.isSubmitting = false;
        this.toastService.success(`Import completed! ${importedCount} books imported successfully.`);
        if (errorCount > 0) {
          this.toastService.warning(`${errorCount} books failed to import.`);
        }
        this.closeImportCsvModal();
        this.loadBooks(); // Refresh the list
        return;
      }

      const book = validBooks[index];
      this.csvImportProgress = Math.round(((index + 1) / validBooks.length) * 100);

      // Map CSV data to Book interface format
      const bookData = {
        Title: book.Title || book.title,
        Author: book.Author || book.author,
        ISBN: book.ISBN || book.isbn,
        Category: book.Category || book.category,
        Subject: book.Subject || book.subject,
        PublishedYear: book.PublishedYear || book.publicationYear,
        CopyrightYear: book.CopyrightYear || book.copyrightYear,
        Publisher: book.Publisher || book.publisher,
        CallNumber: book.CallNumber || book.callNumber,
        DeweyDecimal: book.DeweyDecimal || book.deweyDecimal,
        Copies: book.Copies || book.quantity || 1,
        Remarks: book.Remarks || book.description || '',
        Status: book.Status || 'Available',
        ShelfLocation: book.ShelfLocation || book.location || '',
        AcquisitionDate: book.AcquisitionDate || new Date().toISOString().split('T')[0]
      };

      this.apiService.post('/api/v1/books/add-book', bookData).subscribe({
        next: (response: any) => {
          if (response.success) {
            importedCount++;
          } else {
            errorCount++;
          }
          importNext(index + 1);
        },
        error: (error) => {
          console.error('Error importing book:', error);
          errorCount++;
          importNext(index + 1);
        }
      });
    };

    importNext(0);
  }

  exportToCsv(): void {
    if (this.books.length === 0) {
      this.toastService.warning('No books to export');
      return;
    }

    const headers = ['Title', 'Author', 'ISBN', 'Category', 'Subject', 'PublishedYear', 'CopyrightYear', 'Publisher', 'CallNumber', 'DeweyDecimal', 'Copies', 'Remarks', 'Status', 'ShelfLocation', 'AcquisitionDate'];
    const exportData = this.books.map(book => ({
      Title: book.Title,
      Author: book.Author,
      ISBN: book.ISBN,
      Category: book.Category,
      Subject: book.Subject,
      PublishedYear: book.PublishedYear,
      CopyrightYear: book.CopyrightYear,
      Publisher: book.Publisher,
      CallNumber: book.CallNumber,
      DeweyDecimal: book.DeweyDecimal,
      Copies: book.Copies,
      Remarks: book.Remarks,
      Status: book.Status,
      ShelfLocation: book.ShelfLocation,
      AcquisitionDate: book.AcquisitionDate
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    this.csvService.generateCsv(exportData, headers, `books_export_${timestamp}.csv`);
    this.toastService.success('Books exported successfully!');
  }

  downloadBookTemplate(): void {
    this.csvService.generateBookTemplate();
    this.toastService.info('Book CSV template downloaded!');
  }
}
