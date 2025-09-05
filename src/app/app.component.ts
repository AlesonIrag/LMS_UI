import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { QuoteSchedulerService } from './services/quote-scheduler.service';
import { FooterComponent } from './shared/components/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Library-Management-System-AI';
  showFooter = true;
  hideFooterRoutes = [
    '/login', 
    '/adminlogin', 
    '/facultylogin',
    '/student-dashboard',
    '/faculty-dashboard',
    '/dashboard'
  ];

  constructor(
    private quoteScheduler: QuoteSchedulerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Quote scheduler is automatically initialized via dependency injection
    console.log('📱 App initialized with Quote Scheduler');
    
    // Subscribe to route changes to determine footer visibility
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if current route should hide footer
        this.showFooter = !this.hideFooterRoutes.some(route => 
          event.url.startsWith(route)
        );
      });
  }
}