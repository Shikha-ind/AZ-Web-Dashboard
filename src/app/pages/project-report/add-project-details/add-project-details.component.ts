import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { projectReport, ProjectReportService } from '../service/project-report.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-project-details',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './add-project-details.component.html',
  styleUrl: './add-project-details.component.css'
})
export class AddProjectDetailsComponent {
  regions: projectReport[] = [];
  projectForm!: FormGroup;

  constructor(private projectService: ProjectReportService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddProjectDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      next_id: [this.data?.next_id || '', Validators.required],
      project_name: [this.data?.project_name || '', Validators.required],
      region: [this.data?.region || '', Validators.required],
      market: [this.data?.market || '', Validators.required],
      start_date: [this.data?.start_date || '', Validators.required],
      end_date: [this.data?.end_date || '', Validators.required],
      project_manager: [this.data?.project_manager || ''],
      developer: [this.data?.developer || ''],
      reviewer: [this.data?.reviewer || ''],
      scope: [this.data?.scope || '',],
      status: [this.data?.status || 'Open'],
      po_number: [this.data?.po_number || ''],
      cost: [this.data?.cost || null],
      brand: [this.data?.brand || ''],
      no_of_pages: [this.data?.no_of_pages || null],
      comments: [this.data?.comments || '']
    });

      this.projectService.getRegions().subscribe({
      next: data => this.regions = data,
      error: err => {
        console.error('Failed to load regions', err);
        this.regions = [];
      }
    });
  }

onSubmit(): void {
  if (this.projectForm.valid) {
    const formValue = { ...this.projectForm.value };

    // Format date fields
    const formatDate = (d: any) => {
      if (!d) return null;
      const date = new Date(d);
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    };

    formValue.start_date = formatDate(formValue.start_date);
    formValue.end_date = formatDate(formValue.end_date);

    // Convert numeric fields properly
    formValue.cost = parseFloat(formValue.cost);
    formValue.no_of_pages = parseInt(formValue.no_of_pages, 10);

    // Fallbacks if number conversion fails
    if (isNaN(formValue.cost)) formValue.cost = null;
    if (isNaN(formValue.no_of_pages)) formValue.no_of_pages = null;

    const isEdit = !!this.data?.pr_id;
    const request$ = isEdit
      ? this.projectService.updateProjectsReports(this.data.pr_id, formValue)
      : this.projectService.addProjectsReports(formValue);

    request$.subscribe({
      next: () => {
        const action = isEdit ? 'updated' : 'created';
        alert(`Project ${action} successfully`);
        this.dialogRef.close({ [action]: true, updatedData: formValue });
      },
      error: (err) => {
        console.error(`${isEdit ? 'Update' : 'Create'} failed:`, err);
        alert(`Failed to ${isEdit ? 'update' : 'create'} project. Please check field values.`);
      }
    });
  }
  window.location.reload();
}



    onCancel(): void {
    this.dialogRef.close();
  }
}
