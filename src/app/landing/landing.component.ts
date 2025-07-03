import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent implements OnInit, OnDestroy {
  private currentSlide = 0;
  private slides: NodeListOf<Element> | null = null;
  private slideInterval: any;

  ngOnInit() {
    // Mobile menu functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Background slideshow functionality
    this.initializeSlideshow();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private initializeSlideshow() {
    // Wait a bit for the DOM to be fully rendered
    setTimeout(() => {
      this.slides = document.querySelectorAll('.slide');
      if (this.slides && this.slides.length > 0) {
        console.log('Found slides:', this.slides.length);
        // Start the slideshow
        this.slideInterval = setInterval(() => {
          this.nextSlide();
        }, 4000); // Change slide every 4 seconds
      } else {
        console.log('No slides found');
      }
    }, 100);
  }

  private nextSlide() {
    if (!this.slides || this.slides.length === 0) return;

    console.log('Changing slide from', this.currentSlide, 'to', (this.currentSlide + 1) % this.slides.length);

    // Remove active class from current slide
    this.slides[this.currentSlide].classList.remove('active');

    // Move to next slide
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;

    // Add active class to new slide
    this.slides[this.currentSlide].classList.add('active');
  }
}