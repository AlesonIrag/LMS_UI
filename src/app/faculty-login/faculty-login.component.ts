import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faculty-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './faculty-login.html',
  styleUrl: './faculty-login.css'
})
export class FacultyLoginComponent {

  // Prevent all non-alphanumeric input for faculty ID
  onFacultyIdKeydown(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];

    // Allow navigation and control keys
    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Allow alphanumeric characters
    if (!/^[a-zA-Z0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Handle faculty ID input formatting - alphanumeric only, no dashes
  onFacultyIdInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Remove any non-alphanumeric characters (no dashes allowed for faculty)
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');

    // Limit to 12 characters for faculty ID
    if (value.length > 12) {
      value = value.substring(0, 12);
    }

    // Convert to uppercase for consistency
    input.value = value.toUpperCase();
    this.hideFacultyIdError();
  }

  // Handle faculty ID blur validation
  onFacultyIdBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.validateFacultyId(input);
  }

  // Validate faculty ID format
  validateFacultyId(input: HTMLInputElement): void {
    const value = input.value.trim();
    const errorDiv = document.getElementById('facultyIdError');
    
    if (!value) {
      this.showFacultyIdError('Faculty ID is required!');
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-200');
    } else if (value.length < 6) {
      this.showFacultyIdError('Faculty ID must be at least 6 characters!');
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-200');
    } else {
      this.hideFacultyIdError();
      input.classList.remove('border-red-500');
      input.classList.add('border-gray-200');
    }
  }

  // Show faculty ID error
  showFacultyIdError(message: string): void {
    const errorDiv = document.getElementById('facultyIdError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }

  // Hide faculty ID error
  hideFacultyIdError(): void {
    const errorDiv = document.getElementById('facultyIdError');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
  }

  // Handle password input
  onPasswordInput(event: Event): void {
    this.hidePasswordError();
  }

  // Handle password blur validation
  onPasswordBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.validatePassword(input);
  }

  // Validate password
  validatePassword(input: HTMLInputElement): void {
    const value = input.value.trim();
    
    if (!value) {
      this.showPasswordError('Password is required!');
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-200');
    } else {
      this.hidePasswordError();
      input.classList.remove('border-red-500');
      input.classList.add('border-gray-200');
    }
  }

  // Show password error
  showPasswordError(message: string): void {
    const errorDiv = document.getElementById('passwordError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }

  // Hide password error
  hidePasswordError(): void {
    const errorDiv = document.getElementById('passwordError');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
    }
  }

  // Handle form submission
  onSubmit(event: Event): void {
    event.preventDefault();

    const facultyIdInput = document.getElementById('facultyId') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    // Always validate both fields to show individual error messages
    this.validateFacultyId(facultyIdInput);
    this.validatePassword(passwordInput);

    // Check if both fields are valid
    if (!facultyIdInput.value.trim() || facultyIdInput.value.length < 6) {
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      isValid = false;
    }

    if (isValid) {
      alert('Faculty login form is valid! Ready to submit to faculty database.');
      // Handle successful faculty login here - connect to faculty database
    }
  }
}
