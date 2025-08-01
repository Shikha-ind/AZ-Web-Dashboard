import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';


export const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
        {
        path: 'project-report',
        loadComponent: () =>
          import('./pages/project-report/project-report.component').then((m) => m.ProjectReportComponent)
      },
      {
        path: 'revenue',
        loadComponent: () =>
          import('./pages/revenue/revenue.component').then((m) => m.RevenueComponent)
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./pages/teams/teams.component').then((m) => m.TeamsComponent)
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./pages/documents/documents.component').then((m) => m.DocumentsComponent)
      },
     {
        path: 'other',
        loadComponent: () =>
          import('./pages/other/other.component').then((m) => m.OtherComponent),
         children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/other/othermain/othermain.component').then((m) => m.OthermainComponent)
          },
          {
            path: 'testimonials',
            loadComponent: () =>
              import('./pages/other/testimonials/testimonials.component').then((m) => m.TestimonialsComponent)
          },
          {
            path: 'aspire',
            loadComponent: () =>
              import('./pages/other/aspire/aspire.component').then((m) => m.AspireComponent)
          },
          {
            path: 'weekly-report',
            loadComponent: () =>
              import('./pages/other/weekly-report/weekly-report.component').then((m) => m.WeeklyReportComponent)
          },
          {
            path: 'monthly-report',
            loadComponent: () =>
              import('./pages/other/monthly-report/monthly-report.component').then((m) => m.MonthlyReportComponent)
          },
          {
            path: 'case-study',
            loadComponent: () =>
            import('./pages/other/case-study/case-study.component').then((m) => m.CaseStudyComponent)
          },
          {
            path: 'issue-tracker',
            loadComponent: () =>
              import('./pages/other/issue-tracker/issue-tracker.component').then((m) => m.IssueTrackerComponent)
          },
          {
            path: 'risk-register',
            loadComponent: () =>
              import('./pages/other/risk-register/risk-register.component').then((m) => m.RiskRegisterComponent)
          },
          {
            path: 'rca-report',
            loadComponent: () =>
              import('./pages/other/rca-report/rca-report.component').then((m) => m.RcaReportComponent)
          }        
        ]
      },
      {
        path: '',
        redirectTo: 'team',
        pathMatch: 'full'
      }
    ]
  }
];