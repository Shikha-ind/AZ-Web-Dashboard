import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DeleteRcaComponent } from './delete-rca/delete-rca.component';
import { AddRcaComponent } from './add-rca/add-rca.component';
import { DocumentType, RcaService } from './service/rca.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rca-report',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './rca-report.component.html',
  styleUrl: './rca-report.component.css'
})
export class RcaReportComponent {
    allDocuments: any[] = [];
  originalDocuments: any[] = [];
  paginatedDocuments: any[] = [];
selectedMonth: string = '';
  selectedType: string = '';
  uniqueTypes: string[] = [];
 allMonth: any[] = [];
  filteredTestimonials: any[] = [];

  displayedColumns: string[] = ['serial_no', 'month', 'region', 'root_cause', 'reported_by', 'action'];

  currentPage = 1;
  pageSize = 7;

  documentType: DocumentType[] = [];
  iconUrl: string = '';

  constructor(private rcaService: RcaService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadDocumentTypes();
    this.loadDocuments();
    this.loadMonths();


  }

  loadDocumentTypes(): void {
    this.rcaService.getDocumentType().subscribe({
      next: (docs: any[]) => {
        this.documentType = docs;
      },
      error: err => console.error('Failed to load document types:', err)
    });
  }

  loadDocuments(): void {
    this.rcaService.getRca().subscribe({
      next: (data) => {
        this.allDocuments = [...data];
        this.originalDocuments = [...data];
        this.extractUniqueTypes();
        this.applyPagination();
      },
      error: err => console.error('Error fetching documents:', err)
    });
  }

loadMonths(): void {
  this.rcaService.getMonths().subscribe({
    next: (months) => {
      this.allMonth = months;
      console.log('Months loaded:', this.allMonth); // ✅ Debug here
    },
    error: (err) => console.error('Failed to load months:', err)
  });
}


  openAddDocdialog(): void {
    const dialogRef = this.dialog.open(AddRcaComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.added) {
        this.loadDocuments();
      }
    });
  }

  viewFile(filePath: string): void {
  if (!filePath) {
    console.error('No file provided');
    return;
  }

  const url = `http://localhost:4000/uploads/rca/${filePath}`;
  window.open(url, '_blank'); // Open in a new tab
}

getDownloadUrl(filePath: string): string {
  return `http://localhost:4000/uploads/rca/${filePath}`;
}



//   getDownloadUrl(filePath: string): string {
//    if (!filePath) return ''; 
//   return `http://localhost:4000/uploads/rca/${filePath}`;
// }

// viewFile(filePath: string): void {
//   const url = this.getDownloadUrl(filePath);
//   if (url) {
//     window.open(url, '_blank');
//   } else {
//     console.warn('Invalid or missing file path');
//   }
// }

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
      this.resetDocuments();
      return;
    }

    const filtered = this.allDocuments.filter(doc =>
      doc.reported_by?.toLowerCase().includes(filterValue) ||
      doc.region?.toLowerCase().includes(filterValue)
    );

    this.paginatedDocuments = filtered.slice(0, this.pageSize);
    this.currentPage = 1;
  }

  filterByType(): void {
    this.currentPage = 1;

    if (!this.selectedType) {
      this.allDocuments = this.originalDocuments.filter(
        doc => doc.type?.toLowerCase() === this.selectedType.toLowerCase()
      );
    } else {
      this.allDocuments = [...this.originalDocuments];
    }

    this.applyPagination();
  }

//     filterByType(): void {
//   if (!this.selectedType) {
//       this.filteredTestimonials = [...this.allDocuments];
//     } else {
//       this.filteredTestimonials = this.allDocuments.filter(t =>
//         t.created_at?.startsWith(this.selectedType) // type = "2024-07"
//       );
//     }
//     this.currentPage = 1;
//     this.applyPagination();
// }



  opendocDeleteDialog(doc: any): void {
    const dialogRef = this.dialog.open(DeleteRcaComponent, { data: doc });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.deleted) {
        this.loadDocuments();
      }
    });
  }

  // ===================== PAGINATION =====================
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

  resetDocuments(): void {
    this.allDocuments = [...this.originalDocuments];
    this.applyPagination();
    this.currentPage = 1;
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
