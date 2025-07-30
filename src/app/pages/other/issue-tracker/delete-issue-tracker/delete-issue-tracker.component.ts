import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IssueTrackerService } from '../service/issue-tracker.service';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-delete-issue-tracker',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './delete-issue-tracker.component.html',
  styleUrl: './delete-issue-tracker.component.css'
})
export class DeleteIssueTrackerComponent {
  isDeleting = false;
    
    constructor(
      public dialogRef: MatDialogRef<DeleteIssueTrackerComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any ,private issueService: IssueTrackerService
    ) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onYesClick(profile: any): void {
      this.isDeleting = true;
      this.issueService.deleteIssue(profile.it_id).subscribe({
        next: () => {
         this.dialogRef.close({ deleted: true, it_id: profile.it_id });
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Delete failed:', err);
        }
      });
    }

}
