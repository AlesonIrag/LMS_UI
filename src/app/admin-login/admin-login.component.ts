import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {

  // Prevent all non-alphanumeric input for admin ID
  onAdminIdKeydown(event: KeyboardEvent): void {
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

  // Handle admin ID input formatting
  onAdminIdInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Limit to 10 characters for admin ID
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    input.value = value.toUpperCase();
    this.hideAdminIdError();
  }

  // Handle admin ID blur validation
  onAdminIdBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.validateAdminId(input);
  }

  // Validate admin ID format
  validateAdminId(input: HTMLInputElement): void {
    const value = input.value.trim();
    const errorDiv = document.getElementById('adminIdError');
    
    if (!value) {
      this.showAdminIdError('Admin ID is required!');
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-200');
    } else if (value.length < 5) {
      this.showAdminIdError('Admin ID must be at least 5 characters!');
      input.classList.add('border-red-500');
      input.classList.remove('border-gray-200');
    } else {
      this.hideAdminIdError();
      input.classList.remove('border-red-500');
      input.classList.add('border-gray-200');
    }
  }

  // Show admin ID error
  showAdminIdError(message: string): void {
    const errorDiv = document.getElementById('adminIdError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }

  // Hide admin ID error
  hideAdminIdError(): void {
    const errorDiv = document.getElementById('adminIdError');
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

    const adminIdInput = document.getElementById('adminId') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    // Always validate both fields to show individual error messages
    this.validateAdminId(adminIdInput);
    this.validatePassword(passwordInput);

    // Check if both fields are valid
    if (!adminIdInput.value.trim() || adminIdInput.value.length < 5) {
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      isValid = false;
    }

    if (isValid) {
      alert('Admin login form is valid! Ready to submit to admin database.');
      // Handle successful admin login here - connect to admin database
    }
  }
}
