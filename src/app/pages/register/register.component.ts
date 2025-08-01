import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message = '';
  roles: { id: number; role: string }[] = []; 
  mainImage = '../images/login-right-image.png';
  astraLogo = '../images/AZ logo - Footer.png';
  indeLogo = '../images/logo.png';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    // Form setup
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]] 
    });

    // Load roles from backend
    this.authService.getRoles().subscribe({
      next: (res) => (this.roles = res),
      error: (err) => console.error('Failed to load roles', err)
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const userData = {
      id: Date.now().toString(), // or UUID
      name: this.registerForm.value.name,
      emailId: this.registerForm.value.emailId,
      password: this.registerForm.value.password,
      empId: '',
      band: '',
      designation: '',
      region: '',
      emailPrid: '',
      emailAz: '',
      imageUrl: '',
      market: '',
      role: this.registerForm.value.role, 
      date_of_joining: new Date().toISOString().slice(0, 10)
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.message = 'Registration successful!';
        this.registerForm.reset();
      },
      error: (err) => {
        this.message = 'Error: ' + (err.error?.message || 'Unknown error');
      }
    });
  }
}
