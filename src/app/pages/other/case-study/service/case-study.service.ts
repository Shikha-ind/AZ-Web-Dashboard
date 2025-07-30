import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface caseType {
  document_name: string;
  iconUrl: string;
  created_at?: string;
}


@Injectable({
  providedIn: 'root'
})
export class CaseStudyService {

  private apiUrl = 'http://localhost:4000/api/case-studies';
  
    constructor(private http: HttpClient) {}
  
    getCasestudy(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
  
   addCasestudy(formData: FormData) {
    return this.http.post(`${this.apiUrl}`, formData);
  }
  
   deleteCasestudy(serial_no: string): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      return this.http.delete(`${this.apiUrl}/${serial_no}`, { headers });
    }
  
     /** Get regions list from server */
    getRegions(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/regions`);
    }
  
  getDocumentType(): Observable<caseType[]> {
    return this.http.get<caseType[]>(`${this.apiUrl}/document-type`);
  }
}
