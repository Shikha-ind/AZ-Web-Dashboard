import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DeleteIssueTrackerComponent } from './delete-issue-tracker/delete-issue-tracker.component';
import { AddIssueTrackerComponent } from './add-issue-tracker/add-issue-tracker.component';
import { IssueTracker, IssueTrackerService } from './service/issue-tracker.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { DetailsIssueTrackerComponent } from './details-issue-tracker/details-issue-tracker.component';

@Component({
  selector: 'app-issue-tracker',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './issue-tracker.component.html',
  styleUrl: './issue-tracker.component.css'
})
export class IssueTrackerComponent {
  originalDocuments: any[] = [];
  paginatedDocuments: any[] = [];
  uniqueTypes: string[] = [];

  allMonth: { value: string, label: string }[] = [];
  selectedMonth: string = '';
  selectedType: string = '';

  allIssues: any[] = [];
  filteredIssues: any[] = [];

  displayedColumns: string[] = [
    'region', 'reported_by', 'reported_date', 'campaign_name', 'issue_description',
    'stage', 'ticket_no', 'issue_owner', 'status', 'action'
  ];

  currentPage = 1;
  pageSize = 4;

  constructor(private issueTrackerService: IssueTrackerService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadMonths();
    this.loadDocuments();
  }

  loadMonths(): void {
    this.issueTrackerService.getMonths().subscribe({
      next: (months) => {
        this.allMonth = months;
      },
      error: (err) => {
        console.error('Failed to load months:', err);
      }
    });
  }

  loadDocuments(): void {
    this.issueTrackerService.getIssues().subscribe({
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

  openAddCasedialog(): void {
    const dialogRef = this.dialog.open(AddIssueTrackerComponent, {
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

  getDownloadUrl(filePath: string): string {
    return `http://localhost:4000/uploads/${filePath}`;
  }

openIssueDetailsDialog(it_id: number): void {
  this.issueTrackerService.getIssueById(it_id).subscribe({
    next: (issueData) => {
      this.dialog.open(DetailsIssueTrackerComponent, {
        id: 'issueDetail',
        data: issueData 
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

  filterByMonth(): void {
    this.currentPage = 1;
    if (this.selectedMonth) {
      this.allIssues = this.originalDocuments.filter(doc =>
        doc.reported_date?.startsWith(this.selectedMonth)
      );
    } else {
      this.allIssues = [...this.originalDocuments];
    }
    this.applyPagination();
  }

  opendocDeleteDialog(doc: any): void {
    const dialogRef = this.dialog.open(DeleteIssueTrackerComponent, { data: doc });

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
    this.filterByMonth();
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
