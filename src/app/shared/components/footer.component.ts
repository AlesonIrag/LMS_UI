import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="bg-black py-12 border-t-8 border-orange-500">
      <div class="container mx-auto px-6">
        <!-- Mobile/Tablet: Grid Layout (below 1000px) -->
        <div class="block xl:hidden">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <!-- Get in Touch Section -->
            <div class="text-center md:text-left">
              <h3 class="text-xl font-bold text-white mb-4">Contact Us</h3>
              <div class="space-y-3 text-gray-300">
                <div class="flex items-center justify-center md:justify-start">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>(032) 345-5790</span>
                </div>
                <div class="flex items-center justify-center md:justify-start">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>benedictocollege.library@gmail.com</span>
                </div>
                <div class="flex items-center justify-center md:justify-start">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>A.S. Fortuna Street, Mandaue City</span>
                </div>
              </div>
            </div>

            <!-- Quick Links Section -->
            <div class="text-center md:text-left">
              <h3 class="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a routerLink="/about" class="block text-gray-400 hover:text-green-400 transition duration-300">About Us</a>
                <a routerLink="/contact" class="block text-gray-400 hover:text-green-400 transition duration-300">Contact</a>
              </div>
            </div>

            <!-- Connect with Us Section -->
            <div class="text-center md:text-left">
              <h3 class="text-xl font-bold text-white mb-4">Connect with Us</h3>
              <div class="flex justify-center md:justify-start space-x-4 mb-4">
                <a href="https://facebook.com/benedictocollegeofficial" target="_blank" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Facebook">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://benedictocollege.edu.ph" target="_blank" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Official Website">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"></path>
                  </svg>
                </a>
                <a href="benedictocollege.library@gmail.com" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Email">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </a>
                <a href="tel:+6332455790" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Call Us">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </a>
              </div>
              <!-- Operating Hours -->
              <div class="text-sm text-gray-400">
                <div class="flex items-center justify-center md:justify-start mb-1">
                  <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold">Library Hours:</span>
                </div>
                <div class="text-xs">Mon-Fri: 7:00 AM - 8:00 PM</div>
                <div class="text-xs">Sat: 8:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: Flexbox Layout (1000px and beyond) -->
        <div class="hidden xl:block">
          <div class="flex justify-between items-start mb-8">
            <!-- Get in Touch Section -->
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-4">Get in Touch</h3>
              <div class="space-y-3 text-gray-300">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span>(032) 345-5790</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>library@benedictocollege.edu.ph</span>
                </div>
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>A.S. Fortuna Street, Mandaue City</span>
                </div>
              </div>
            </div>

            <!-- Quick Links Section -->
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-4">Quick Links</h3>
              <div class="space-y-2">
                <a routerLink="/about" class="block text-gray-400 hover:text-green-400 transition duration-300">About Us</a>
                <a routerLink="/contact" class="block text-gray-400 hover:text-green-400 transition duration-300">Contact</a>
              </div>
            </div>

            <!-- Connect with Us Section -->
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-4">Connect with Us</h3>
              <div class="flex space-x-4 mb-4">
                <a href="https://facebook.com/benedictocollegeofficial" target="_blank" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Facebook">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://benedictocollege.edu.ph" target="_blank" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Official Website">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"></path>
                  </svg>
                </a>
                <a href="mailto:benedictocollege.library@gmail.com" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Email">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </a>
                <a href="tel:+6332455790" class="bg-gray-800 hover:bg-green-500 p-3 rounded-full transition duration-300 transform hover:scale-110" title="Call Us">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </a>
              </div>
              <!-- Operating Hours -->
              <div class="text-sm text-gray-400">
                <div class="flex items-center mb-1">
                  <svg class="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-semibold">Library Hours:</span>
                </div>
                <div class="text-xs">Mon-Fri: 7:00 AM - 8:00 PM</div>
                <div class="text-xs">Sat: 8:00 AM - 5:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright Section -->
        <div class="border-t border-gray-700 pt-6">
          <div class="flex flex-col xl:flex-row justify-between items-center">
            <div class="text-gray-400 mb-4 xl:mb-0 text-center xl:text-left">
              &copy; <span id="creditYearRange">2025-2026</span> Benedicto College Library Management System. All Rights Reserved.
            </div>
            <div class="text-gray-400 text-sm text-center xl:text-right">
              Your Education… Our Mission
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .border-orange-500 {
      border-top-color: #f97316;
    }
    
    .bg-black {
      background-color: #000;
    }
    
    .text-white {
      color: #fff;
    }
    
    .text-gray-300 {
      color: #d1d5db;
    }
    
    .text-gray-400 {
      color: #9ca3af;
    }
    
    .hover\\:text-green-400:hover {
      color: #4ade80;
    }
    
    .bg-gray-800 {
      background-color: #1f2937;
    }
    
    .hover\\:bg-green-500:hover {
      background-color: #4ade80;
    }
    
    .border-gray-700 {
      border-color: #374151;
    }
    
    .text-green-400 {
      color: #4ade80;
    }
  `]
})
export class FooterComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch and update credit year range
    this.loadCreditYearRange();
  }
  
  private loadCreditYearRange(): void {
    // Fetch credit year range from backend
    this.http.get<any>('http://localhost:3000/api/v1/system-settings/credit-year-range').subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const creditYearRangeElement = document.getElementById('creditYearRange');
          if (creditYearRangeElement) {
            creditYearRangeElement.textContent = response.data.creditYearRange;
          }
        }
      },
      error: (error) => {
        console.error('Failed to load credit year range:', error);
        // Keep default value
      }
    });
  }
}