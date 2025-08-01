import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddProjectDetailsComponent } from '../add-project-details/add-project-details.component';
import { jwtDecode } from 'jwt-decode';
import { ProjectReportService } from '../service/project-report.service';  // Corrected service name
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialoug-project-detail',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './dialoug-project-detail.component.html',
  styleUrls: ['./dialoug-project-detail.component.css']
})
export class DialougProjectDetailComponent implements OnInit {

  constructor(
    private projectReport: ProjectReportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialougProjectDetailComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // You can load or process data if needed here
  }

  onEdit(): void {
    const editDialog = this.dialog.open(AddProjectDetailsComponent, {
      data: { ...this.data }
    });

    editDialog.afterClosed().subscribe(result => {
      if (result?.updated && result.updatedData) {
        this.data = result.updatedData; // update local copy
        this.dialogRef.close({ updated: true }); // trigger parent refresh
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
