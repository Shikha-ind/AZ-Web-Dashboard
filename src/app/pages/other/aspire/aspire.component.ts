import { Component } from '@angular/core';
import { AddAspireComponent } from './add-aspire/add-aspire.component';
import { jwtDecode } from 'jwt-decode';
import {AspireSrviceService } from './aspire-srvice.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { Aspire } from './aspire.model';

@Component({
  selector: 'app-aspire',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './aspire.component.html',
  styleUrl: './aspire.component.css'
})
export class AspireComponent {
teamBox = '../images/team-box.png';
openEnvelop = '../icons/email.png';
imageBudges = '../images/budges-image.png';

aspires: Aspire[] = [];
leftAspires: Aspire[] = [];
rightAspires: Aspire[] = [];
filteredAspires: Aspire[] = [];
paginatedAspires: Aspire[] = [];

selectedType: string = '';
regions: string[] = [];
allMonth: { value: string; label: string }[] = [];

currentPage = 1;
totalsPages = 1;
itemsPerPage = 4;
pages: number[] = [];

constructor(
  private aspireService: AspireSrviceService,
  private dialog: MatDialog,
  private authService: AuthService
) {}

ngOnInit(): void {
   this.aspireService.getAspireEntries().subscribe(data => {
    this.aspires = data;

    // Split into two halves
    const mid = Math.ceil(data.length / 2);
    this.leftAspires = data.slice(0, mid);
    this.rightAspires = data.slice(mid);
  });
  this.loadAspires();
  this.loadRegions();
  this.loadMonths();
}

/** Load aspire entries */
loadAspires(): void {
  this.aspireService.getAspireEntries().subscribe(aspires => {
    this.aspires = aspires;
    this.filteredAspires = [...aspires];
    this.applyPaginationFromFiltered();

    
  });
}

/** Load region list */
loadRegions(): void {
  this.aspireService.getRegions().subscribe({
    next: (data: string[]) => this.regions = data,
    error: err => console.error('Failed to load regions:', err)
  });
}

/** Load available months for filtering */
loadMonths(): void {
  this.aspireService.getMonths().subscribe({
    next: (months: { value: string; label: string }[]) => {
      this.allMonth = months;
    },
    error: err => console.error('Failed to load months:', err)
  });
}

/** Search entries by multiple fields */
aspireFilter(event: KeyboardEvent): void {
  const query = (event.target as HTMLInputElement).value.toLowerCase().trim();

  this.filteredAspires = this.aspires.filter(t =>
    (
      (t.to?.toLowerCase().includes(query) ?? false) ||
      (t.from?.toLowerCase().includes(query) ?? false) ||
      (t.award_name?.toLowerCase().includes(query) ?? false) ||
      (t.award_type?.toLowerCase().includes(query) ?? false) ||
      (t.service_name?.toLowerCase().includes(query) ?? false) ||
      (t.region_name?.toLowerCase().includes(query) ?? false)
    ) &&
    (!this.selectedType || (t.created_at?.startsWith(this.selectedType) ?? false))
  );

  this.currentPage = 1;
  this.applyPaginationFromFiltered();
}


/** Filter by selected month (from dropdown) */
filterByType(): void {
  if (!this.selectedType) {
    this.filteredAspires = [...this.aspires];
  } else {
    this.filteredAspires = this.aspires.filter(t =>
      t.created_at?.startsWith(this.selectedType)
    );
  }
  this.currentPage = 1;
  this.applyPaginationFromFiltered();
}

/** Paginate filtered data */
applyPaginationFromFiltered(): void {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;

  // Paginated chunk from filteredAspires
  const pageItems = this.filteredAspires.slice(start, end);

  // Split evenly into two columns
  const mid = Math.ceil(pageItems.length / 2);
  this.leftAspires = pageItems.slice(0, mid);
  this.rightAspires = pageItems.slice(mid);

  // For paginator buttons
  this.totalsPages = Math.ceil(this.filteredAspires.length / this.itemsPerPage);
  this.pages = Array.from({ length: this.totalsPages }, (_, i) => i + 1);
}


/** Pagination navigation */
changePages(page: number): void {
  this.currentPage = page;
  this.applyPaginationFromFiltered();
}

/** Toggle like */
// toggleLike(item: Aspire): void {
//   const userId = this.authService.getUserId();

//   if (!userId) {
//     console.error('User not authenticated');
//     return;
//   }

//   this.aspireService.toggleLike(userId, item.sp_id).subscribe({
//     next: (res: { liked: boolean }) => {
//       item.isLiked = res.liked;
//       item.likes = res.liked ? (item.likes ?? 0) + 1 : Math.max((item.likes ?? 1) - 1, 0);
//     },
//     error: (err) => {
//       console.error('Failed to toggle like', err);
//     }
//   });
// }

toggleLike(item: Aspire): void {
  const userId = this.authService.getUserId(); // should return a number or string

  // Check if userId is valid
  if (userId === null || userId === undefined) {
    console.error('User not authenticated');
    return;
  }

  // Toggle like through service
  this.aspireService.toggleLike(userId, item.sp_id).subscribe({
    next: (res: { liked: boolean }) => {
      item.isLiked = res.liked;

      // Update like count safely
      if (res.liked) {
        item.likes = (item.likes ?? 0) + 1;
      } else {
        item.likes = Math.max((item.likes ?? 1) - 1, 0);
      }
    },
    error: (err) => {
      console.error('Failed to toggle like', err);
    }
  });
}

/** Role-based permission */
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

/** Open Add Form Dialog */
openAddAspire(profile?: any) {
 const dialogRef = this.dialog.open(AddAspireComponent, {
    data: profile || {}
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result?.added) {
      this.loadAspires(); // Refresh the aspire list
    }
  });
}

/** Build file download URL */
getDownloadUrl(fileName?: string): string {
  return fileName ? `http://localhost:4000/uploads/${fileName}` : '';
}


}
