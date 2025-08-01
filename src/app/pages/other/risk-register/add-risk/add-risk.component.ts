import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { RiskService } from '../service/risk.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-risk',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './add-risk.component.html',
  styleUrl: './add-risk.component.css'
})
export class AddRiskComponent implements OnInit {
  riskForm!: FormGroup;
  regions: string[] = [];

  priorities = ['Low', 'Medium', 'High', 'Critical'];
  statuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Unresolved'];

  // Properly injected MatDialogRef
  // private dialogRef = inject(MatDialogRef<AddRiskComponent>);
  // private fb = inject(FormBuilder);
  // private riskService = inject(RiskService) public data: any;

   constructor(
      private riskService: RiskService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddRiskComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

  ngOnInit(): void {
      this.riskForm = this.fb.group({
      region: [this.data?.region || '', Validators.required],
      reported_by: [this.data?.reported_by || '', Validators.required],
      priority: [this.data?.priority || '', Validators.required],
      status: [this.data?.status || '', Validators.required],
      risk_description: [this.data?.risk_description || '', Validators.required],
      impact_area: [this.data?.impact_area || '', Validators.required]
    });


    this.riskService.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => console.error('Failed to load regions', err)
    });
  }

  onSubmit(): void {

      if (this.riskForm.valid) {
    const formValue = this.riskForm.value;

    // Determine whether to create or update
    if (this.data?.rr_id) {
      this.riskService.updateRisk(this.data.rr_id, formValue).subscribe({
        next: () => {
          alert('Issue updated successfully');
          this.dialogRef.close({ updated: true, updateIssue: formValue });
        },
        error: err => {
          console.error('Update failed:', err);
        }
      });
    } else {
      this.riskService.addRisk(formValue).subscribe({
        next: () => {
          alert('Issue created successfully');
          this.dialogRef.close({ added: true });
        },
        error: err => {
          console.error('Create failed:', err);
        }
      });
    }
  }
  }

  // onReset(): void {
  //   this.riskForm.reset();
  // }
    onCancel(): void {
    this.dialogRef.close();
  }
}
