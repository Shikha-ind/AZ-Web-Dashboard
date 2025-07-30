import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaseStudyService } from '../service/case-study.service';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-delete-case-study',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-case-study.component.html',
  styleUrl: './delete-case-study.component.css'
})
export class DeleteCaseStudyComponent {

   isDeleting = false;
    
    constructor(
      public dialogRef: MatDialogRef<DeleteCaseStudyComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any ,private casestudyService: CaseStudyService
    ) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
    onYesClick(profile: any): void {
      this.isDeleting = true;
      this.casestudyService.deleteCasestudy(profile.serial_no).subscribe({
        next: () => {
         this.dialogRef.close({ deleted: true, id: profile.serial_no });
        },
        error: (err) => {
          this.isDeleting = false;
          console.error('Delete failed:', err);
        }
      });
    }

}
