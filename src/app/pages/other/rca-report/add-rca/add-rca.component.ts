import { Component, OnInit } from '@angular/core';
import { DocumentType, RcaService } from '../service/rca.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-add-rca',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './add-rca.component.html',
  styleUrl: './add-rca.component.css'
})
export class AddRcaComponent implements OnInit{

  rcaForm: FormGroup;
    selectedFile: File | null = null;
    selectedFileName: string = '';
   regions: string[] = [];
    documentType: DocumentType[] = [];
    selectedIconUrl: string = '';
    fileTypeError: string = '';
  
    constructor(
      private fb: FormBuilder,
      private rcaService: RcaService,
      private dialogRef: MatDialogRef<AddRcaComponent>
    ) {
      this.rcaForm = this.fb.group({
        root_cause: ['', Validators.required],
        reported_by: ['', Validators.required],
        type: ['', Validators.required],
        region: ['', Validators.required]
      });
    }
  
    onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const selectedType = this.rcaForm.get('type')?.value;
  
    if (!file || !selectedType) return;
  
    const fileName = file.name.toLowerCase();
    const typeMap: { [key: string]: string[] } = {
      pdf: ['.pdf'],
      doc: ['.doc', '.docx'],
      ppt: ['.ppt', '.pptx'] 
    };
  
    const allowedExtensions = typeMap[selectedType.toLowerCase()] || [];
  
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext));
  
    if (!isValid) {
      this.fileTypeError = `Only ${allowedExtensions.join(', ')} files are allowed for type "${selectedType}"`;
      this.selectedFile = null;
      this.selectedFileName = '';
      input.value = '';
    } else {
      this.fileTypeError = '';
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  
  
    }
  
      ngOnInit(): void {
       this.rcaService.getRegions().subscribe({
    next: (data) => {
      this.regions = data; // data should be a string[] like ['India', 'US', ...]
    },
    error: (err) => {
      console.error('Failed to load regions:', err);
    }
  });

      this.rcaService.getDocumentType().subscribe({
            next: (data) => {
              this.documentType = data;
            },
            error: (err) => {
              console.error('Failed to load document types:', err);
            }
          });
    }
    
  
    onSubmit(): void {
      if (this.rcaForm.invalid || !this.selectedFile) return;
  
      const formData = new FormData();
      formData.append('root_cause', this.rcaForm.get('root_cause')?.value);
      formData.append('reported_by', this.rcaForm.get('reported_by')?.value);
      formData.append('type', this.rcaForm.get('type')?.value);
      formData.append('region', this.rcaForm.get('region')?.value);
      // formData.append('action', this.selectedFile);
       if (this.selectedFile) {
      formData.append('upload', this.selectedFile); // Must match multer field name
    }
  
      this.rcaService.addRca(formData).subscribe({
        next: () => {
          alert('RCA added successfully');
          this.dialogRef.close({ added: true });
        },
        error: err => {
          console.error('Failed to add RCA:', err);
          alert('Failed to add RCA');
        }
      });
    }
  
    onCancel(): void {
      this.dialogRef.close();
    }

}
