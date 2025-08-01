import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.forgotPasswordForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('emailId')!;
  }

 onSubmit(): void {
  if (this.forgotPasswordForm.valid) {
    const emailPayload = {
      emailId: this.forgotPasswordForm.value.emailId 
    };

    this.http.post('http://localhost:4000/api/users/forgot-password', emailPayload).subscribe({
      next: () => this.message = 'Reset link sent successfully!',
      error: (err) => {
        console.error('Error sending reset link:', err);
        this.message = 'Something went wrong. Please try again later.';
      }
    });
  }
}

}
