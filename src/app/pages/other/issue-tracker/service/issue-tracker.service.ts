import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface IssueTracker {
  document_name: string;
  iconUrl: string;
  created_at?: string;
  value: string; 
  label: string; 
}

@Injectable({
  providedIn: 'root'
})
export class IssueTrackerService {
  private apiUrl = 'http://localhost:4000/api/issues-tracker';

  constructor(private http: HttpClient) {}

  getIssues(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }
  getIssueById(it_id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${it_id}`);
}

  addIssue(issueForm: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log("-------AddTeamFor---------");
    return this.http.post(`${this.apiUrl}`, issueForm, { headers });
  }

  deleteIssue(it_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiUrl}/${it_id}`, { headers });
  }

  updateIssue(it_id: string, updatedData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiUrl}/${it_id}`, updatedData, { headers });
  }


    getRegions(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/regions`);
    }

    getMonths(): Observable<IssueTracker[]> {
      return this.http.get<IssueTracker[]>(`${this.apiUrl}/months`);
    }
}
