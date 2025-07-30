import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface projectReport {
  document_name: string;
  iconUrl: string;
  created_at?: string;
  value: string; 
  label: string; 
  region_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectReportService {

   private apiUrl = 'http://localhost:4000/api/projects-reports';
  
    constructor(private http: HttpClient) {}
  
    getProjectsReports(): Observable<any[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.get<any[]>(`${this.apiUrl}`, { headers });
    }
    getProjectsReportsById(it_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${it_id}`);
  }
  
    addProjectsReports(issueForm: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log("-------AddTeamFor---------");
      return this.http.post(`${this.apiUrl}`, issueForm, { headers });
    }
  
    deleteProjectsReports(pr_id: string): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.delete(`${this.apiUrl}/${pr_id}`, { headers });
    }
  
    updateProjectsReports(pr_id: string, updatedData: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.put(`${this.apiUrl}/${pr_id}`, updatedData, { headers });
    }
  
  
      getRegions(): Observable<projectReport[]> {
        return this.http.get<projectReport[]>(`${this.apiUrl}/region`);
      }
  
      // getMonths(): Observable<IssueTracker[]> {
      //   return this.http.get<IssueTracker[]>(`${this.apiUrl}/months`);
      // }
}
