import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { AddRevenueComponent } from './add-revenue/add-revenue.component';
import { RevenueService } from './service/revenue.service';
import { MatDialog } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  selectedMonth: string = '';
  revenueData: any[] = [];
  originalDocuments: any[] = [];
  allMonth: { value: string; label: string }[] = [];
  revenueBars: any[] = [];
  region: string = '';
    regions: any[] = [];

//   revenueItems = [
//   { label: 'Canada FTE', color: '#1E40AF', value: '$6.34k', width: '60%' },
//   { label: 'CEEBA HCP Portals', color: '#0EA5E9', value: '$6.34k', width: '60%' },
//   { label: 'UK FTE', color: '#EC4899', value: '$6.34k', width: '60%' },
//   { label: 'WESE Catalog', color: '#111827', value: '$6.34k', width: '60%' },
//   { label: 'UK Catalog', color: '#8B5CF6', value: '$6.34k', width: '60%' },
//   { label: 'Canada Catalog', color: '#9CA3AF', value: '$6.34k', width: '60%' },
// ];

  constructor(
    private revenueService: RevenueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRevenue();
    this.loadMonths();
    this.loadBreakdown();
  }

  loadRevenue(): void {
    this.revenueService.getRevenue().subscribe({
      next: (data) => {
        console.log('Revenue data from API:', data);
        this.originalDocuments = data.map(row => ({
          ...row,
          totalRev: +(Number(row.onsite_revenue || 0) + Number(row.offshore_revenue || 0)).toFixed(2),
          totalHC: +(Number(row.onsite_hc || 0) + Number(row.offshore_hc || 0)).toFixed(2)
        }));

        this.revenueData = [...this.originalDocuments]; // initialize revenueData with all data
      },
      error: (err) => console.error('Error fetching revenue data:', err)
    });
  }

  loadMonths(): void {
    this.revenueService.getMonths().subscribe({
      next: (months) => {
        this.allMonth = months;
      },
      error: (err) => {
        console.error('Failed to load months:', err);
      }
    });
  }

 loadBreakdown(): void {
    this.revenueService.getRevenue().subscribe({
      next: (data) => {
        this.regions = data.map(regionData => {
          const items = [
            { key: 'canada_fte', label: 'Canada FTE', color: '#1E40AF' },
            { key: 'ceeba_hcp', label: 'CEEBA HCP Portals', color: '#0EA5E9' },
            { key: 'uk_fte', label: 'UK FTE', color: '#EC4899' },
            { key: 'wese_catalog', label: 'WESE Catalog', color: '#111827' },
            { key: 'uk_catalog', label: 'UK Catalog', color: '#8B5CF6' },
            { key: 'canada_catalog', label: 'Canada Catalog', color: '#9CA3AF' }
          ];

          const max = Math.max(...items.map(i => Number(regionData[i.key]) || 0));

          const processedItems = items.map(i => {
            const value = Number(regionData[i.key]) || 0;
            return {
              label: i.label,
              color: i.color,
              value,
              formattedValue: `$${(value / 1000).toFixed(2)}k`,
              width: max ? ((value / max) * 100).toFixed(0) + '%' : '0%'
            };
          });

          return {
            region: regionData.region,
            items: processedItems
          };
        });
      },
      error: (err) => console.error('Error loading breakdown:', err)
    });
  }

  filterByMonth(): void {
    if (this.selectedMonth) {
      this.revenueData = this.originalDocuments.filter(row => {
        const month = row.reported_date?.substring(0, 7); // Assumes 'YYYY-MM-DD' or 'YYYY-MM'
        return month === this.selectedMonth;
      });
    } else {
      this.revenueData = [...this.originalDocuments];
    }
  }

  openAddRevenuedialog(): void {
    const dialogRef = this.dialog.open(AddRevenueComponent, {
      width: '900px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadRevenue(); // reload after new entry
      }
    });
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
