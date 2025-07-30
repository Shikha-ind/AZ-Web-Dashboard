import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaseStudyService } from '../service/case-study.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material/material.module';
import { CommonModule } from '@angular/common';
import { DocumentType } from '../../../documents/services/document-type.model';

@Component({
  selector: 'app-add-case-study',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './add-case-study.component.html',
  styleUrl: './add-case-study.component.css'
})
export class AddCaseStudyComponent implements OnInit {
  casestudyForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  regions: string[] = [];
  documentType: DocumentType[] = [];
  fileTypeError: string = '';

  constructor(
    private fb: FormBuilder,
    private casestudyService: CaseStudyService,
    private dialogRef: MatDialogRef<AddCaseStudyComponent>
  ) {
    this.casestudyForm = this.fb.group({
      file_name: ['', [Validators.required, Validators.minLength(3)]],
      related_to: ['', Validators.required],
      type: ['', Validators.required],
      region: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.casestudyService.getRegions().subscribe({
      next: (data) => (this.regions = data),
      error: (err) => console.error('Failed to load regions', err)
    });

    this.casestudyService.getDocumentType().subscribe({
      next: (data) => (this.documentType = data),
      error: (err) => console.error('Failed to load document types:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const selectedType = this.casestudyForm.get('type')?.value;

    if (!file || !selectedType) return;

    const fileName = file.name.toLowerCase();
    const typeMap: { [key: string]: string[] } = {
      pdf: ['.pdf'],
      doc: ['.doc', '.docx'],
      ppt: ['.ppt', '.pptx'],
      xls: ['.xls', '.xlsx'],
      mp3: ['.mp3']
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

  onSubmit(): void {
    if (this.casestudyForm.invalid || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('file_name', this.casestudyForm.get('file_name')?.value);
    formData.append('related_to', this.casestudyForm.get('related_to')?.value);
    formData.append('type', this.casestudyForm.get('type')?.value);
    formData.append('region', this.casestudyForm.get('region')?.value);
     if (this.selectedFile) {
    formData.append('upload', this.selectedFile); // Must match multer field name
  }

    //formData.append('upload', this.selectedFile); // backend expects 'upload' key

    this.casestudyService.addCasestudy(formData).subscribe({
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
