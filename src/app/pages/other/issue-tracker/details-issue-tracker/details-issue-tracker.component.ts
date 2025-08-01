import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../material/material.module';
import { IssueTrackerService } from '../service/issue-tracker.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AddIssueTrackerComponent } from '../add-issue-tracker/add-issue-tracker.component';
@Component({
  selector: 'app-details-issue-tracker',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './details-issue-tracker.component.html',
  styleUrl: './details-issue-tracker.component.css'
})
export class DetailsIssueTrackerComponent {

  constructor(
    private issueService: IssueTrackerService, @Inject(MAT_DIALOG_DATA) public issue: any,
        private dialogRef: MatDialogRef<DetailsIssueTrackerComponent>,
        private dialog: MatDialog,
  ) {}

  ngOnInit(): void {

  }

    onEdit(): void {
    const editDialog = this.dialog.open(AddIssueTrackerComponent, {
      data: {
        ...this.issue
      }
    });
  
    editDialog.afterClosed().subscribe(result => {
      if (result?.updated && result.updateIssue) {
        this.issue = result.updateIssue; // update local copy
        this.dialogRef.close({ updated: true });
        window.location.reload(); // or use event emitter to refresh list
      }
    });
  }

      isTeamLeadOrPM(): boolean {
        const token = localStorage.getItem('token');
        if (!token) return false;
    
        try {
          const decoded: any = jwtDecode(token);
          return ['Team Lead', 'Project Manager'].includes(decoded.role);
        } catch {
          return false;
        }
      }

}
