import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { TestimonialsServiceService } from '../service/testimonials-service.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-testimonials',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-testimonials.component.html',
  styleUrl: './add-testimonials.component.css'
})
export class AddTestimonialsComponent implements OnInit {

  testimonialform!: FormGroup;
regions: any[] = [];
serviceTypes: any[] = [];
message: string = '';
imagePreview: string | ArrayBuffer | null = null;
selectedFile: File | null = null;  // <== IMPORTANT

constructor(
  public dialogRef: MatDialogRef<AddTestimonialsComponent>,
  private fb: FormBuilder,
  private testimonialService: TestimonialsServiceService
) {}

ngOnInit(): void {
  this.testimonialform = this.fb.group({
    from: ['', Validators.required],
    to: ['', Validators.required],
    service_name: ['', Validators.required],
    content: ['', Validators.required],
    region_name: ['', Validators.required],
    upload_path: [''] // optional, backend will get filename
  });

  this.testimonialService.getRegions().subscribe({
    next: data => this.regions = data,
    error: err => console.error('Failed to load regions', err)
  });

  this.testimonialService.getServiceTypes().subscribe({
    next: data => this.serviceTypes = data,
    error: err => console.error('Failed to load service types', err)
  });
}

onCancel(): void {
  this.dialogRef.close();
}

onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

submit(): void {
  if (this.testimonialform.invalid) {
    this.message = 'Please fill all required fields.';
    return;
  }

  const formData = new FormData();
  formData.append('to', this.testimonialform.value.to);
  formData.append('from', this.testimonialform.value.from);
  formData.append('service_name', this.testimonialform.value.service_name);
  formData.append('region_name', this.testimonialform.value.region_name);
  formData.append('content', this.testimonialform.value.content);

  if (this.selectedFile) {
    formData.append('upload', this.selectedFile); // Must match multer field name
  }

  this.testimonialService.addTestimonial(formData).subscribe({
    next: () => {
      this.message = 'Testimonial submitted successfully!';
      this.testimonialform.reset();
      this.imagePreview = null;
      this.selectedFile = null;
      this.dialogRef.close(true); // optionally close dialog
    },
    error: err => {
      console.error('Error submitting testimonial:', err);
      this.message = 'Submission failed. Please try again.';
    }
  });
}


  
}
