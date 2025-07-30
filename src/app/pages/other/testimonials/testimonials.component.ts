import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';
import { AddTestimonialsComponent } from './add-testimonials/add-testimonials.component';
import { MatDialog } from '@angular/material/dialog';
import { TestimonialsServiceService } from './service/testimonials-service.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Testimonial } from './service/testimonial.model';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [MaterialModule, CommonModule, MatSelectModule, FormsModule ],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})

export class TestimonialsComponent implements OnInit {
  teamBox = '../images/team-box.png';
  openEnvelop = '../icons/email.png';
  imageBudges = '../images/budges-image.png';

  testimonials: Testimonial[] = [];
  filteredTestimonials: Testimonial[] = [];
  paginatedTestimonials: Testimonial[] = [];

  selectedType: string = '';
  testimonialTypes: string[] = [];

  regions: string[] = [];

  currentPages = 1;
  totalsPages = 1;
  itemsPerPage = 2;
  pages: number[] = [];

  allMonth: Testimonial[] = [];

  constructor(
    private testimonialService: TestimonialsServiceService,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTestimonials();
    this.loadRegions();
     this.loadMonths();
  }

  /** Load testimonials */
  loadTestimonials(): void {
    this.testimonialService.getTestimonials().subscribe(testimonials => {
      this.testimonials = testimonials;
      this.filteredTestimonials = [...testimonials];
      this.applyPaginationFromFiltered();
    });
  }

  /** Load region list */
  loadRegions(): void {
    this.testimonialService.getRegions().subscribe({
      next: (data: string[]) => this.regions = data,
      error: err => console.error('Failed to load regions:', err)
    });
  }

  /** Search testimonials by To, From, Service, Region */
  applyFilter(event: KeyboardEvent): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredTestimonials = this.testimonials.filter(t =>
      (t.to?.toLowerCase().includes(query) ||
       t.from?.toLowerCase().includes(query) ||
       t.service_name?.toLowerCase().includes(query) ||
       t.region_name?.toLowerCase().includes(query)) &&
      (!this.selectedType || t.created_at?.startsWith(this.selectedType))
    );

    this.currentPages = 1;
    this.applyPaginationFromFiltered();
  }

  filterByType(): void {
  if (!this.selectedType) {
      this.filteredTestimonials = [...this.testimonials];
    } else {
      this.filteredTestimonials = this.testimonials.filter(t =>
        t.created_at?.startsWith(this.selectedType) // type = "2024-07"
      );
    }
    this.currentPages = 1;
    this.applyPaginationFromFiltered();
}

  /** Pagination for filtered data */
  applyPaginationFromFiltered(): void {
    const start = (this.currentPages - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const source = this.filteredTestimonials;

    this.totalsPages = Math.ceil(source.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalsPages }, (_, i) => i + 1);
    this.paginatedTestimonials = source.slice(start, end);
  }

  loadMonths(): void {
  this.testimonialService.getMonths().subscribe({
    next: (months: Testimonial[]) => {
      this.allMonth = months;
    },
    error: err => console.error('Failed to load months:', err)
  });
}


  /** Change page */
  changePages(page: number): void {
    this.currentPages = page;
    this.applyPaginationFromFiltered();
  }

toggleLike(item: Testimonial): void {
  const userId = this.authService.getUserId(); // should return a number or string

  // Check if userId is valid
  if (userId === null || userId === undefined) {
    console.error('User not authenticated');
    return;
  }

  // Toggle like through service
  this.testimonialService.toggleLike(userId, item.t_id).subscribe({
    next: (res: { liked: boolean }) => {
      item.isLiked = res.liked;
       item.likes = res.liked ? (item.likes ?? 0) + 1 : Math.max((item.likes ?? 1) - 1, 0);
       console.log(userId ,item);

      // Update like count safely
      // if (res.liked) {
      //   item.likes = (item.likes ?? 0) + 1;
      // } else {
      //   item.likes = Math.max((item.likes ?? 1) - 1, 0);
      // }
    },
    error: (err) => {
      console.error('Failed to toggle like', err);
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

    // Add form pop up
  openAddTestimonial(profile?: any) {
    const dialogRef = this.dialog.open(AddTestimonialsComponent, {
      data: profile || {}  // Optional: pass profile or empty object
    });
}

// getDownloadUrl(fileName: string): string {
//   return `http://localhost:4000/uploads/${fileName}`;
// }

getDownloadUrl(fileName: string): string {
  return `http://localhost:4000/uploads/${fileName}`;
}


}
