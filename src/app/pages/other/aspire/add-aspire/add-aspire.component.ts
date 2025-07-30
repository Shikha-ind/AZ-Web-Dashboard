import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { AspireSrviceService } from '../aspire-srvice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-aspire',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './add-aspire.component.html',
  styleUrl: './add-aspire.component.css'
})
export class AddAspireComponent implements OnInit {
  aspireForm!: FormGroup;
  serviceTypes: string[] = [];
  regions: string[] = [];
  message: string = '';
 awardType: string[] = ['Achievement'];
 awardName: string[] = ['Innovation', 'Hitting the Mark'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAspireComponent>,
    private aspireService: AspireSrviceService
  ) {}

  ngOnInit(): void {
    this.aspireForm = this.fb.group({
      to: ['', Validators.required],
      from: ['', Validators.required],
      service_name: ['', Validators.required],
      region_name: ['', Validators.required],
      award_type: ['', Validators.required],  
      award_name: ['', Validators.required], 
      url_link: [''] // optional
    });

    this.loadDropdowns();
  }

  /** Load dropdown values for regions and services */
  loadDropdowns(): void {
    this.aspireService.getRegions().subscribe({
      next: data => this.regions = data,
      error: err => console.error('Failed to load regions', err)
    });

    this.aspireService.getServiceTypes().subscribe({
      next: data => this.serviceTypes = data,
      error: err => console.error('Failed to load service types', err)
    });
  }

  /** Submit Aspire form */
  onSubmit(): void {
    if (this.aspireForm.valid) {
      const formData = this.aspireForm.value;

      this.aspireService.addAspireEntry(formData).subscribe({
        next: () => {
          this.message = 'Aspire entry submitted successfully!';
          this.dialogRef.close(true); // You can emit formData instead if needed
        },
        error: err => {
          console.error('Submission error:', err);
          this.message = 'Failed to submit Aspire entry.';
        }
      });
    } else {
      this.message = 'Please fill all required fields.';
    }
    window.location.reload();
  }

  /** Close the modal */
  onClose(): void {
    this.dialogRef.close();
  }
}
