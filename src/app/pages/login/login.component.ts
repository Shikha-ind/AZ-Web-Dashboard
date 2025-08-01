import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LeftbarComponent } from '../dashboard/leftbar/leftbar.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LeftbarComponent, ReactiveFormsModule, MaterialModule, RouterModule, CommonModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // mainImage = '../images/back.jpg';
  mainImage = '../images/login-right-image.png';
  astraLogo = '../images/AZ logo - Footer.png';
  indeLogo = '../images/logo.png';
  message = '';
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      // emailId: [''],
      // password: ['']
        emailId: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // or use AuthService
        localStorage.setItem('User_email', this.loginForm.value.emailId);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => console.error('Login failed', err)
    });
  }
}

