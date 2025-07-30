import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DeleteProjectDetailComponent } from './delete-project-detail/delete-project-detail.component';
import { AddProjectDetailsComponent } from './add-project-details/add-project-details.component';
import { ProjectReportService } from './service/project-report.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialougProjectDetailComponent } from './dialoug-project-detail/dialoug-project-detail.component';

@Component({
  selector: 'app-project-report',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './project-report.component.html',
  styleUrl: './project-report.component.css'
})
export class ProjectReportComponent {
  originalDocuments: any[] = [];
    paginatedDocuments: any[] = [];
    uniqueTypes: string[] = [];
    regionList: any[] = [];
    selectedRegion: string = '';
  
    allMonth: { value: string, label: string }[] = [];
    selectedMonth: string = '';
    selectedType: string = '';
  
    allIssues: any[] = [];
    filteredIssues: any[] = [];
  
    displayedColumns: string[] = [
      'next_id', 'project_name', 'scope', 'project_manager', 'status',
      'end_date', 'po_number', 'comments', 'action'
    ];
  
    currentPage = 1;
    pageSize = 4;
  
    constructor(private projectService: ProjectReportService, private dialog: MatDialog) {}
  
    ngOnInit(): void {
      this.loadRegions();
      this.loadDocuments();
    }
  
    loadRegions(): void {
         this.projectService.getRegions().subscribe({
      next: (res) => {
        this.regionList = res;
      },
      error: (err) => {
        console.error('Error loading regions:', err);
      }
    });
    }
  
    loadDocuments(): void {
      this.projectService.getProjectsReports().subscribe({
        next: (data) => {
          this.originalDocuments = data;
          this.allIssues = [...data];
          this.extractUniqueTypes();
          this.applyFilterAndPagination();
        },
        error: (err) => {
          console.error('Failed to load issues:', err);
        }
      });
    }
  
    openAddProject(): void {
      const dialogRef = this.dialog.open(AddProjectDetailsComponent, {
        width: '900px',
        data: {}
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result?.added) {
          this.loadDocuments();
        }
      });
    }
  
    applyFilter(event: Event): void {
       const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
     
       if (filterValue === '') {
         // If input is cleared, reset to all documents
         this.paginatedDocuments = this.allIssues.slice(0, this.pageSize);
         this.currentPage = 1;
         return;
       }
     
       const filtered = this.allIssues.filter(doc =>
         doc.reported_by?.toLowerCase().includes(filterValue) ||
         doc.status?.toLowerCase().includes(filterValue) || 
         doc.issue_owner?.toLowerCase().includes(filterValue) ||
         doc.region?.toLowerCase().includes(filterValue) 
       );
     
       this.paginatedDocuments = filtered.slice(0, this.pageSize);
       this.currentPage = 1;
     }
  
       onMarketChange() {
    if (!this.selectedRegion) {
      this.allIssues = [...this.originalDocuments];
    } else {
      const selected = this.selectedRegion.toLowerCase();
      this.allIssues = this.originalDocuments.filter(doc =>
        doc.region?.toLowerCase() === selected
      );
    }
    this.currentPage = 1;
    this.applyPagination();
  }
    getDownloadUrl(filePath: string): string {
      return `http://localhost:4000/uploads/${filePath}`;
    }
  
  openIssueDetailsDialog(pr_id: number): void {
    this.projectService.getProjectsReportsById(pr_id).subscribe({
      next: (updatedData) => {
        this.dialog.open(DialougProjectDetailComponent, {
          id: 'issueDetail',
          data: updatedData 
        });
      },
      error: (err) => {
        console.error('Failed to load issue details:', err);
      }
    });
  }
  
  
    extractUniqueTypes(): void {
      const typesSet = new Set<string>();
      this.originalDocuments.forEach(doc => {
        if (doc.type) typesSet.add(doc.type.toLowerCase());
      });
      this.uniqueTypes = Array.from(typesSet);
    }
  
    applyTextFilter(event: Event): void {
      const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
      this.allIssues = this.originalDocuments.filter(doc =>
        doc.campaign_name?.toLowerCase().includes(filterValue) ||
        doc.reported_by?.toLowerCase().includes(filterValue) 
      );
      this.currentPage = 1;
      this.applyPagination();
    }
  
  
    opendocDeleteDialog(doc: any): void {
      const dialogRef = this.dialog.open(DeleteProjectDetailComponent, { data: doc });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result?.deleted) {
          this.loadDocuments();
        }
      });
    }
  
    // Pagination Logic
    get totalPages(): number {
      return Math.ceil(this.allIssues.length / this.pageSize);
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
      this.paginatedDocuments = this.allIssues.slice(start, end);
    }
  
    applyFilterAndPagination(): void {
      this.onMarketChange();
      this.applyPagination();
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
