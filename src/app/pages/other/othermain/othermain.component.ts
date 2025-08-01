import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-othermain',
  standalone: true,
  imports: [MaterialModule, RouterModule, CommonModule],
  templateUrl: './othermain.component.html',
  styleUrl: './othermain.component.css'
})
export class OthermainComponent {
modules = [
    { title: 'TESTIMONIALS', icon: '../icons/testimonial.png', enter: './testimonials' },
    { title: 'ASPIRE', icon: '../icons/aspirating.png', enter: './aspire'},
    { title: 'WEEKLY REPORT', icon: '../icons/report.png', enter: './weekly-report' },
    { title: 'MONTHLY REPORT', icon: '../icons/report.png', enter: './monthly-report' },
    { title: 'CASE STUDY', icon: '../icons/file-case.png', enter: './case-study' },
    { title: 'ISSUE TRACKER', icon: '../icons/problem.png', enter: './issue-tracker' },
    { title: 'RISK REGISTER', icon: '../icons/risk-management.png', enter: './risk-register' },
    { title: 'RCA REPORT', icon: '../icons/investigate.png', enter: './rca-report' },
  ];
}
