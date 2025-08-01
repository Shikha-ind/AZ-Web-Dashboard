import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DeleteCaseStudyComponent } from './delete-case-study/delete-case-study.component';
import { AddCaseStudyComponent } from './add-case-study/add-case-study.component';
import { CaseStudyService, caseType } from './service/case-study.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-case-study',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './case-study.component.html',
  styleUrl: './case-study.component.css'
})
export class CaseStudyComponent {

   allCaseStudy: any[] = [];
   originalDocuments: any[] = []; 
   paginatedDocuments: any[] = [];
   selectedType: string = '';
   uniqueTypes: string[] = [];
 
   displayedColumns: string[] = ['serial_no', 'file_name', 'related_to', 'type',  'action'];
 
   currentPage = 1;
   pageSize = 7;
 
 documentType: caseType[] = [];
 
   constructor(private caseService: CaseStudyService, private dialog: MatDialog) {}
 
   ngOnInit(): void {
    this.caseService.getDocumentType().subscribe({
      next: (doc: caseType[]) => {
        this.documentType = doc;
      },
      error: (err) => {
        console.error('Failed to load document types:', err);
      }
    });
       
     this.loadDocuments();
   }
 
   loadDocuments(): void {
     this.caseService.getCasestudy().subscribe({
       next: (data) => {
         this.allCaseStudy = data;
         this.originalDocuments = data;            
       this.allCaseStudy = [...data];     
         this.extractUniqueTypes();
         this.applyPagination();
       },
       error: err => console.error('Error fetching documents:', err)
     });
   }
 
   openAddCasedialog(): void {
     const dialogRef = this.dialog.open(AddCaseStudyComponent, {
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
     this.allCaseStudy.forEach(doc => {
       if (doc.type) typesSet.add(doc.type.toLowerCase());
     });
     this.uniqueTypes = Array.from(typesSet);
   }
 
   applyFilter(event: Event): void {
   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
 
   if (filterValue === '') {
     // If input is cleared, reset to all documents
     this.paginatedDocuments = this.allCaseStudy.slice(0, this.pageSize);
     this.currentPage = 1;
     return;
   }
 
   const filtered = this.allCaseStudy.filter(doc =>
     doc.file_name?.toLowerCase().includes(filterValue)
   );
 
   this.paginatedDocuments = filtered.slice(0, this.pageSize);
   this.currentPage = 1;
 }
 
   filterByType(): void {
   this.currentPage = 1; // Reset pagination
 
   if (this.selectedType) {
     this.allCaseStudy = this.originalDocuments.filter(
       doc => doc.type?.toLowerCase() === this.selectedType.toLowerCase()
     );
   } else {
     // Reset to full list
     this.allCaseStudy = [...this.originalDocuments];
   }
 
   this.applyPagination();
 }
 
 
 
   opendocDeleteDialog(doc: any): void {
     const dialogRef = this.dialog.open(DeleteCaseStudyComponent, { data: doc });
 
     dialogRef.afterClosed().subscribe(result => {
       if (result?.deleted) {
         this.loadDocuments();
       }
     });
   }
 
   // ========== PAGINATION ==========
   get totalPages(): number {
     return Math.ceil(this.allCaseStudy.length / this.pageSize);
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
     this.paginatedDocuments = this.allCaseStudy.slice(start, end);
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
