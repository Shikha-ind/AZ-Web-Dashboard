import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { AddTeamDetailsComponent } from '../add-team-details/add-team-details.component';
import { TeamServiceService } from '../team-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { jwtDecode } from 'jwt-decode';

// interface Skill {
//   name: string;
//   level: number; // from 1 to 10
//   color: 'primary' | 'accent' | 'warn';
// }

@Component({
  selector: 'app-team-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MaterialModule],
  templateUrl: './team-detail-dialog.component.html',
  styleUrl: './team-detail-dialog.component.css'
})
export class TeamDetailDialogComponent {

  skills: any[] = [];
  dataSource = new MatTableDataSource<any>();
  teams: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TeamDetailDialogComponent>,
    private dialog: MatDialog, private teamService: TeamServiceService
  ) {
  }


ngOnInit(): void {
 if (this.data?.id) {
    this.teamService.getSkillsByTeamId(this.data.id).subscribe({
      next: (res) => {
        this.skills = res;
        // Optional: add color mapping
        this.skills.forEach(skill => {
          skill.color = this.getSkillColor(skill.level);
        });
      },
      error: (err) => console.error('Error fetching skills:', err)
    });
  }
}


getSkillColor(level: number): string {
  if (level >= 8) return 'strong-skill';    // strong skill
  if (level >= 5) return 'moderate-skill';     // moderate
  return 'weak-skill';                       // weak
}


  onEdit(): void {
  const editDialog = this.dialog.open(AddTeamDetailsComponent, {
    data: {
      ...this.data,
      skills: this.skills 
    }
  });

  editDialog.afterClosed().subscribe(result => {
    if (result?.updated && result.updatedTeam) {
      this.dialogRef.close({ updated: true });
      this.data = result.updatedTeam;
      window.location.reload();
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
