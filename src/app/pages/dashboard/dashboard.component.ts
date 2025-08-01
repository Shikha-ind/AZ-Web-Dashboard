import { Component } from '@angular/core';
import { LeftbarComponent } from './leftbar/leftbar.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LeftbarComponent, RouterModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    astraLogo = '../images/AZ logo - Footer.png';
    indeLogo = '../images/logo.png';
    team = '../icons/team.png';
    document = '../icons/document.png';
    other = '../icons/other.png';
    project = '../icons/project-report.png'

    constructor(private authService: AuthService, private router: Router) {}

     logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
