import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { IssueTrackerService } from '../service/issue-tracker.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-issue-tracker',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './add-issue-tracker.component.html',
  styleUrls: ['./add-issue-tracker.component.css']  // Correct property name
})
export class AddIssueTrackerComponent implements OnInit {
  regions: string[] = [];
  statuses = ['Open', 'In Progress', 'Resolved', 'Closed', 'Unresolved'];
  issueForm!: FormGroup;
  

  constructor(
    private issueTrackerService: IssueTrackerService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddIssueTrackerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
   this.issueForm = this.fb.group({
    region: [this.data?.region || '', Validators.required],
    reported_by: [this.data?.reported_by || '', Validators.required],
    campaign_name: [this.data?.campaign_name || '', Validators.required],
    workstream: [this.data?.workstream || '', Validators.required],
    reported_date: [this.data?.reported_date || '', Validators.required],
    ticket_no: [this.data?.ticket_no || '', Validators.required],
    stage: [this.data?.stage || '', Validators.required],
    paid: [this.data?.paid || '', Validators.required],
    likelyhood: [this.data?.likelyhood || '', Validators.required],
    impact: [this.data?.impact || '', Validators.required],
    issue_owner: [this.data?.issue_owner || '', Validators.required],
    status: [this.data?.status || '', Validators.required],
    issue_description: [this.data?.issue_description || '', Validators.required],
    mitigation_plan: [this.data?.mitigation_plan || '', Validators.required],
    rc_summary: [this.data?.rc_summary || '', Validators.required],
  });

    this.issueTrackerService.getRegions().subscribe({
      next: data => this.regions = data,
      error: err => {
        console.error('Failed to load regions', err);
        this.regions = []; // fallback
      }
    });

       this.issueForm.patchValue({
      created_by: localStorage.getItem('User_email') || 'unknown'
    });
  }

  onSubmit(): void {
  if (this.issueForm.valid) {
    const formValue = this.issueForm.value;

    // Convert reported_date to 'YYYY-MM-DD' format
    if (formValue.reported_date) {
      const date = new Date(formValue.reported_date);
      formValue.reported_date = date.toISOString().split('T')[0]; // => '2025-07-15'
    }

    // Determine whether to create or update
    if (this.data?.it_id) {
      this.issueTrackerService.updateIssue(this.data.it_id, formValue).subscribe({
        next: () => {
          alert('Issue updated successfully');
          this.dialogRef.close({ updated: true, updateIssue: formValue });
        },
        error: err => {
          console.error('Update failed:', err);
        }
      });
    } else {
      this.issueTrackerService.addIssue(formValue).subscribe({
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

  onCancel(): void {
    this.dialogRef.close();
  }
}
