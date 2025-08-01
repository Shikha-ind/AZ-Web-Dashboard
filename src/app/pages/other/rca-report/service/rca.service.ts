import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentType {
  document_name: string;
  iconUrl: string;
  created_at?: string;
  value: string; // e.g., "2024-07"
  label: string; // e.g., "July 2024"
}

@Injectable({
  providedIn: 'root'
})
export class RcaService {

   private apiUrl = 'http://localhost:4000/api/rca';

  constructor(private http: HttpClient) {}

  getRca(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 addRca(formData: FormData) {
  return this.http.post(`${this.apiUrl}`, formData);
}

 deleteRca(rca_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${rca_id}`, { headers });
  }

   /** Get regions list from server */
  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }

  getDocumentType(): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${this.apiUrl}/document-type`);
  }

getMonths(): Observable<DocumentType[]> {
  return this.http.get<DocumentType[]>(`${this.apiUrl}/months`);
}
  
}
