import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from '../services/document.service';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css'
})
export class DeleteComponent {
    isDeleting = false;
  
  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ,private documentService: DocumentService
  ) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onYesClick(profile: any): void {
    this.isDeleting = true;
    this.documentService.deleteDocument(profile.serial_no).subscribe({
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
