import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RevenueService, Revenue } from '../service/revenue.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-revenue',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './add-revenue.component.html',
  styleUrls: ['./add-revenue.component.css']  
})
export class AddRevenueComponent {
   revenueForm!: FormGroup;
   regions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRevenueComponent>,
    private revenueService: RevenueService
  ) {}

  ngOnInit(): void {
this.revenueForm = this.fb.group({
      region: ['', Validators.required],
      onsite_revenue: [null, Validators.required],
      onsite_hc: [null, Validators.required],
      offshore_revenue: [null, Validators.required], 
      offshore_hc: [null, Validators.required],
      ideal_hc_nearshore: [null],
      ideal_hc_offshore: [null],
      excess_offshore: [null],
      excess_nearshore: [null],
      canada_fte: [null],
      uk_fte: [null],
      uk_catalog: [null],
      ceeba_hcp: [null],
      wese_catalog: [null],
      canada_catalog: [null],
      plan_of_action: ['']
    });

    this.revenueService.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => console.error('Failed to load regions', err)
    });
  }

 onSubmit(): void {
  if (this.revenueForm.valid) {
    let formData = this.revenueForm.value;

    // Replace undefined with null
    Object.keys(formData).forEach(key => {
      if (formData[key] === undefined) {
        formData[key] = null;
      }
    });

       // Add total revenue (optional step)
    // const totalRev = (formData.onsite_revenue || 0) + (formData.offshore_revenue || 0);
    // formData.total_revenue = totalRev;

    // const totalHc = (formData.onsite_hc || 0) + (formData.offshore_hc || 0);
    // formData.total_revenue = totalHc;

    this.revenueService.createRevenue(formData).subscribe({
      next: (response) => {
        console.log('Data saved successfully:', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error saving data:', err);
      }
    });
  }
}


  onCancel(): void {
    this.dialogRef.close();
  }
}
