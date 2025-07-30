import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { DocumentService } from '../services/document.service';
import { DocumentType } from '../services/document-type.model';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [CommonModule,  MaterialModule, ReactiveFormsModule],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.css'
})
export class AddDocumentComponent {

  documentForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  regions: string[] = []; // Loaded from DB 
  documentType: DocumentType[] = [];
  selectedIconUrl: string = '';
  fileTypeError: string = '';

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private dialogRef: MatDialogRef<AddDocumentComponent>
  ) {
    this.documentForm = this.fb.group({
      file_name: ['', Validators.required],
      related_to: ['', Validators.required],
      type: ['', Validators.required],
      region: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  const selectedType = this.documentForm.get('type')?.value;

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
      this.documentService.getRegions().subscribe({
        next: data => this.regions = data,
        error: err => console.error('Failed to load regions', err)
    });
 this.documentService.getDocumentType().subscribe({
      next: (data) => {
        this.documentType = data;
      },
      error: (err) => {
        console.error('Failed to load document types:', err);
      }
    });
  }
  

  onSubmit(): void {
    if (this.documentForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('file_name', this.documentForm.get('file_name')?.value);
    formData.append('related_to', this.documentForm.get('related_to')?.value);
    formData.append('type', this.documentForm.get('type')?.value);
    formData.append('region', this.documentForm.get('region')?.value);
    // formData.append('action', this.selectedFile);
     if (this.selectedFile) {
    formData.append('upload', this.selectedFile); // Must match multer field name
  }

    this.documentService.addDocument(formData).subscribe({
      next: () => {
        alert('Document added successfully');
        this.dialogRef.close({ added: true });
      },
      error: err => {
        console.error('Failed to add document:', err);
        alert('Failed to add document');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  
}