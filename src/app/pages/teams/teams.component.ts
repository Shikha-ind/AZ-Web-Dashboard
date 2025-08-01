import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { jwtDecode } from 'jwt-decode';

import { MaterialModule } from '../../material/material.module';
import { TeamServiceService } from './team-service.service';
import { AddTeamDetailsComponent } from './add-team-details/add-team-details.component';
import { DeleteTeamComponent } from './delete-team/delete-team.component';
import { TeamDetailDialogComponent } from './team-detail-dialog/team-detail-dialog.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    AddTeamDetailsComponent
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent {
  regionList: any[] = [];

  teams: any[] = [];
  filteredTeamMembers: any[] = [];

  selectedRegion: string = '';
  searchText: string = '';
  currentPage = 1;
  pageSize = 10;

  expand = '../images/expand.png';

  constructor(
    private dialog: MatDialog,
    private teamService: TeamServiceService
  ) {}

  ngOnInit() {
    this.teamService.getRegions().subscribe({
      next: (res) => {
        this.regionList = res;
      },
      error: (err) => {
        console.error('Error loading regions:', err);
      }
    });
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams = data;
      this.filteredTeamMembers = [...data];
    });
  }

  // Display heading
  get headingTitle(): string {
  return this.selectedRegion ? this.selectedRegion : 'All Teams';
}
  // ---------------- FILTERS ----------------

  onMarketChange() {
    if (!this.selectedRegion) {
      this.filteredTeamMembers = [...this.teams];
    } else {
      const selected = this.selectedRegion.toLowerCase();
      this.filteredTeamMembers = this.teams.filter(team =>
        team.region?.toLowerCase() === selected
      );
    }
    this.currentPage = 1;
  }

  get filteredMembers() {
    const search = this.searchText.toLowerCase();
    return this.filteredTeamMembers.filter(member =>
      member.name?.toLowerCase().includes(search) ||
      member.designation?.toLowerCase().includes(search)
    );
  }

  get paginatedFilteredMembers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMembers.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    const totalPages = Math.ceil(this.filteredMembers.length / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  get totalPages() {
    return Math.ceil(this.filteredMembers.length / this.pageSize);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  // ---------------- ACTIONS ----------------
  openDetails(member: any): void {
    this.dialog.open(TeamDetailDialogComponent, {
      maxWidth: '900px',
      data: member,
      // data: selectedTeam
    });
  }

  // Add form pop up
openAddDialog(profile?: any) {
  const dialogRef = this.dialog.open(AddTeamDetailsComponent, {
    data: profile || {}  // Optional: pass profile or empty object
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.added) {
      this.loadTeams(); // Refresh the team list
    }
  });
}

// Delete pop up
  openDeleteDialog(profile: any) {
    const dialogRef = this.dialog.open(DeleteTeamComponent, {
      data: profile
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.deleted) {
        this.teams = this.teams.filter(team => team.id !== result.id);
        this.onMarketChange(); // refresh filter
      }
    });
  }

// only visible to edit and delete option
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
