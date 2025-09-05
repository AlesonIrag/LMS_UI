import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AnimatedToggleComponent } from '../../shared/components/animated-toggle.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, AnimatedToggleComponent],
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css']
})
export class SystemSettingsComponent implements OnInit {
  // Toggle states
  twoFactorAuthEnabled = true;
  passwordComplexityEnabled = true;
  allowReservations = true;
  emailNotificationsEnabled = true;
  smsNotificationsEnabled = false;
  overdueNotificationsEnabled = true;
  
  // Editable notification settings
  overduePeriodDays = 3;
  reminderDaysBeforeDue = 2;

  // Credit year range setting
  creditYearRange = '2025-2026';

  constructor(
    private themeService: ThemeService,
    private apiService: ApiService
  ) { }

  // Getter for dark mode state from theme service
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode;
  }

  ngOnInit(): void {
    // Component initialization
    this.loadCreditYearRange();
  }

  getTextClasses(): string {
    return this.themeService.getTextClasses();
  }

  getSecondaryTextClasses(): string {
    return this.themeService.getSecondaryTextClasses();
  }

  getCardClasses(): string {
    return this.themeService.getCardClasses();
  }

  // Load credit year range from backend
  loadCreditYearRange(): void {
    this.apiService.getCreditYearRange().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.creditYearRange = response.data.creditYearRange;
        }
      },
      error: (error) => {
        console.error('Failed to load credit year range:', error);
        // Keep default value
      }
    });
  }

  // Save credit year range to backend
  saveCreditYearRange(): void {
    if (!this.creditYearRange.trim()) {
      alert('Credit year range cannot be empty');
      return;
    }

    // Validate format (YYYY or YYYY-YYYY)
    const yearRangeRegex = /^\d{4}(-\d{4})?$/;
    if (!yearRangeRegex.test(this.creditYearRange)) {
      alert('Invalid format. Use "YYYY" or "YYYY-YYYY" format (e.g., "2025" or "2025-2026")');
      return;
    }

    this.apiService.updateCreditYearRange(this.creditYearRange).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Credit year range updated successfully');
        } else {
          alert('Failed to update credit year range: ' + (response.error || 'Unknown error'));
        }
      },
      error: (error) => {
        console.error('Failed to save credit year range:', error);
        alert('Failed to update credit year range: ' + (error.error?.error || error.message || 'Server error'));
      }
    });
  }

  // Handle credit year range input change
  onCreditYearRangeChange(event: any): void {
    this.creditYearRange = event.target.value;
  }

  // Toggle event handlers
  onTwoFactorAuthToggle(checked: boolean): void {
    this.twoFactorAuthEnabled = checked;
    // TODO: Implement actual toggle logic
  }

  onPasswordComplexityToggle(checked: boolean): void {
    this.passwordComplexityEnabled = checked;
    // TODO: Implement actual toggle logic
  }

  onAllowReservationsToggle(checked: boolean): void {
    this.allowReservations = checked;
    // TODO: Implement actual toggle logic
  }

  onEmailNotificationsToggle(checked: boolean): void {
    this.emailNotificationsEnabled = checked;
    // TODO: Implement actual toggle logic
  }

  onSmsNotificationsToggle(checked: boolean): void {
    this.smsNotificationsEnabled = checked;
    // TODO: Implement actual toggle logic
  }

  onOverdueNotificationsToggle(checked: boolean): void {
    this.overdueNotificationsEnabled = checked;
    // TODO: Implement actual toggle logic
  }
  
  // Notification settings change handlers
  onOverduePeriodChange(event: any): void {
    this.overduePeriodDays = event.target.value;
    // TODO: Implement actual update logic
  }
  
  onReminderDaysChange(event: any): void {
    this.reminderDaysBeforeDue = event.target.value;
    // TODO: Implement actual update logic
  }

  // Save all changes
  saveAllChanges(): void {
    // Save credit year range
    this.saveCreditYearRange();
    
    // TODO: Implement saving other settings
    alert('All changes saved successfully!');
  }
}
Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both added:      SYSTEM_INDEX.md
	both added:      src/app/about/about.html
	both added:      src/app/app.component.ts
	both added:      src/app/app.html
	both added:      src/app/app.routes.ts
	both added:      src/app/app.ts
	both added:      src/app/contact/contact.html
	both added:      src/app/dashboard/README.md
	both added:      src/app/dashboard/dashboard.html
	both added:      src/app/dashboard/dashboard.ts
	both added:      src/app/dashboard/system-settings/system-settings.component.html
	both added:      src/app/dashboard/system-settings/system-settings.component.ts
	both added:      src/app/landing/landing.component.ts
	both added:      src/app/landing/landing.html
	both added:      src/app/privacy-policy/privacy-policy.html
	both added:      src/app/services/api.service.ts
	both added:      src/app/services/student-auth.service.ts
	both added:      src/app/student-dashboard/student-dashboard.component.html
	both added:      src/app/student-dashboard/student-dashboard.component.ts
	both added:      src/app/support/support.html
	both added:      src/app/terms-of-service/terms-of-service.html