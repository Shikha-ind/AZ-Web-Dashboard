import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { DocumentService } from './services/document.service';
import { AddDocumentComponent } from './add-document/add-document.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentType } from './services/document-type.model';
import { DeleteComponent } from './delete/delete.component';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})


export class DocumentsComponent {
  allDocuments: any[] = [];
  originalDocuments: any[] = []; 
  paginatedDocuments: any[] = [];
  selectedType: string = '';
  uniqueTypes: string[] = [];

  displayedColumns: string[] = ['serial_no', 'file_name', 'related_to', 'type', 'region', 'action'];

  currentPage = 1;
  pageSize = 7;

 documentType: DocumentType[] = [];
  iconUrl: string = '';

  constructor(private documentService: DocumentService, private dialog: MatDialog) {}

  ngOnInit(): void {
      this.documentService.getDocumentType().subscribe((docs: any[]) => {
      this.documentType = docs; 
    });
      
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (data) => {
        this.allDocuments = data;
        this.originalDocuments = data;            
      this.allDocuments = [...data];     
        this.extractUniqueTypes();
        this.applyPagination();
      },
      error: err => console.error('Error fetching documents:', err)
    });
  }

  openAddDocdialog(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.added) {
        this.loadDocuments();
      }
    });
  }

  getDownloadUrl(filePath: string): string {
    return `http://localhost:4000/uploads/${filePath}`;
  }

  viewFile(filePath: string): void {
    const url = this.getDownloadUrl(filePath);
    window.open(url, '_blank');
  }

  extractUniqueTypes(): void {
    const typesSet = new Set<string>();
    this.allDocuments.forEach(doc => {
      if (doc.type) typesSet.add(doc.type.toLowerCase());
    });
    this.uniqueTypes = Array.from(typesSet);
  }

  applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

  if (filterValue === '') {
    // If input is cleared, reset to all documents
    this.paginatedDocuments = this.allDocuments.slice(0, this.pageSize);
    this.currentPage = 1;
    return;
  }

  const filtered = this.allDocuments.filter(doc =>
    doc.file_name?.toLowerCase().includes(filterValue)
  );

  this.paginatedDocuments = filtered.slice(0, this.pageSize);
  this.currentPage = 1;
}

  filterByType(): void {
  this.currentPage = 1; // Reset pagination

  if (this.selectedType) {
    this.allDocuments = this.originalDocuments.filter(
      doc => doc.type?.toLowerCase() === this.selectedType.toLowerCase()
    );
  } else {
    // Reset to full list
    this.allDocuments = [...this.originalDocuments];
  }

  this.applyPagination();
}



  opendocDeleteDialog(doc: any): void {
    const dialogRef = this.dialog.open(DeleteComponent, { data: doc });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.deleted) {
        this.loadDocuments();
      }
    });
  }

  // ========== PAGINATION ==========
  get totalPages(): number {
    return Math.ceil(this.allDocuments.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  applyPagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDocuments = this.allDocuments.slice(start, end);
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
