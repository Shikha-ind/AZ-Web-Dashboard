import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeamServiceService } from '../team-service.service';

@Component({
  selector: 'app-delete-team',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-team.component.html',
  styleUrl: './delete-team.component.css'
})
export class DeleteTeamComponent {
  // teams: any[] = [];
  isDeleting = false;
//  constructor(
//     public dialogRef: MatDialogRef<DeleteTeamComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any, private teamService: TeamServiceService
//   ) {}

//   onNoClick(): void {
//     this.dialogRef.close(false);
//   }

// //   onYesClick(_id: string): void {
// //     // this.dialogRef.close(true);
// // }
  
// onYesClick(_id: string): void {
//   this.isDeleting = true;
//   this.teamService.deleteTeam(this.data._id).subscribe({
//     next: () => {
//       this.dialogRef.close(true);
//     },
//     error: (err) => {
//       this.isDeleting = false;
//       console.error('Delete failed:', err);
//     }
//   });
// }


constructor(
  public dialogRef: MatDialogRef<DeleteTeamComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any ,private teamService: TeamServiceService
) {}

onNoClick(): void {
  this.dialogRef.close();
}

onYesClick(profile: any): void {
  this.isDeleting = true;
  this.teamService.deleteTeam(profile.id).subscribe({
    next: () => {
     this.dialogRef.close({ deleted: true, id: profile.id });
    },
    error: (err) => {
      this.isDeleting = false;
      console.error('Delete failed:', err);
    }
  });
}



}
