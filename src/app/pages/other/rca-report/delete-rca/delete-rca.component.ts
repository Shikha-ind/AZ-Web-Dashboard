import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RcaService } from '../service/rca.service';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-delete-rca',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-rca.component.html',
  styleUrl: './delete-rca.component.css'
})
export class DeleteRcaComponent {
  isDeleting = false;
    
    constructor(
      public dialogRef: MatDialogRef<DeleteRcaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any ,private rcaService: RcaService
    ) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onYesClick(profile: any): void {
      this.isDeleting = true;
      this.rcaService.deleteRca(profile.rca_id).subscribe({
        next: () => {
         this.dialogRef.close({ deleted: true, id: profile.rca_id });
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Delete failed:', err);
        }
      });
    }
  
  

}
