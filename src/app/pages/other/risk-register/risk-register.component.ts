import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { DeleteRiskComponent } from './delete-risk/delete-risk.component';
import { AddRiskComponent } from './add-risk/add-risk.component';
import { Risk, RiskService } from './service/risk.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';

@Component({
  selector: 'app-risk-register',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './risk-register.component.html',
  styleUrl: './risk-register.component.css'
})
export class RiskRegisterComponent {
  allRisk: any[] = [];
  filteredRisk: any[] = [];
  paginatedDocuments: any[] = [];
  selectedMonth: string = '';
  allMonth: Risk[] = [];
  originalDocuments: any[] = [];

  displayedColumns: string[] = [
    'region',
    'risk_description',
    'reported_by',
    'impact_area',
    'priority',
    'status',
    'action'
  ];

  currentPage = 1;
  pageSize = 7;

  constructor(private riskService: RiskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.riskService.getMonths().subscribe({
      next: (months: Risk[]) => (this.allMonth = months),
      error: err => console.error('Failed to load months:', err)
    });

    this.loadRisk();
  }

  loadRisk(): void {
    this.riskService.getRiskRegister().subscribe({
      next: (data) => {
        this.allRisk = data;
        this.originalDocuments = [...data];
        this.applyCombinedFilters();
      },
      error: err => console.error('Error fetching risk register:', err)
    });
  }

  applySearchFilter(searchText: string): any[] {
    return this.originalDocuments.filter(doc =>
      doc.region?.toLowerCase().includes(searchText) ||
      doc.reported_by?.toLowerCase().includes(searchText) ||
      doc.priority?.toLowerCase().includes(searchText) ||
      doc.status?.toLowerCase().includes(searchText) ||
      doc.risk_description?.toLowerCase().includes(searchText) ||
      doc.impact_area?.toLowerCase().includes(searchText)
    );
  }

  applyMonthFilter(docs: any[]): any[] {
    if (!this.selectedMonth) return docs;

    return docs.filter(doc => {
      const docMonth = new Date(doc.created_at).toISOString().slice(0, 7);
      return docMonth === this.selectedMonth;
    });
  }

  applyCombinedFilters(searchText: string = ''): void {
    let filtered = this.applySearchFilter(searchText.trim().toLowerCase());
    filtered = this.applyMonthFilter(filtered);
    this.filteredRisk = filtered;

    this.currentPage = 1;
    this.applyPagination();
  }

  applyFilter(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value;
    this.applyCombinedFilters(searchText);
  }

  filterByMonth(): void {
    this.applyCombinedFilters(); // uses last search text implicitly
  }

  applyPagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDocuments = this.filteredRisk.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRisk.length / this.pageSize);
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

  openAddRiskdialog(): void {
    const dialogRef = this.dialog.open(AddRiskComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.added) {
        this.loadRisk();
      }
    });
  }

  opendocEditDialog(selectedDoc: any): void {
    const dialogRef = this.dialog.open(AddRiskComponent, {
    width: '700px',
    data: selectedDoc // Pass the full object as data
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.updated) {
      this.loadRisk(); // Reload list after update
    }
  });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.deleted) {
    //     this.loadRisk();
    //   }
    // });
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
