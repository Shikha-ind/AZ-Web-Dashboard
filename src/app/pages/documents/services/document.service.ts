import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentType } from './document-type.model';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {
  private apiUrl = 'http://localhost:4000/api/documents';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 addDocument(formData: FormData) {
  return this.http.post(`${this.apiUrl}`, formData);
}

 deleteDocument(serial_no: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiUrl}/${serial_no}`, { headers });
  }

   /** Get regions list from server */
  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }

getDocumentType(): Observable<DocumentType[]> {
  return this.http.get<DocumentType[]>(`${this.apiUrl}/document-type`);
}
  
}
