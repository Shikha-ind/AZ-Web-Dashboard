import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Aspire } from './aspire.model';


@Injectable({
  providedIn: 'root'
})
export class AspireSrviceService {

 private apiUrl = 'http://localhost:4000/api/aspire';

  constructor(private http: HttpClient) {}

  /** Get all Aspire entries */
  getAspireEntries(): Observable<Aspire[]> {
    return this.http.get<Aspire[]>(this.apiUrl);
  }

  /** Add new Aspire entry */
  addAspireEntry(entry: Aspire): Observable<any> {
    return this.http.post(this.apiUrl, entry);
  }

  /** Delete an Aspire entry by ID */
  deleteAspireEntry(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Get regions */
  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }

  /** Get service types */
  getServiceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/service-types`);
  }

  /** Toggle like */
  toggleLike(userId: number, sp_id: number): Observable<{ liked: boolean }> {
    const body = { user_id: userId, sp_id: sp_id }; 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ liked: boolean }>(`${this.apiUrl}/like`, body, { headers });
  }

  /** Get months for filtering (e.g., July 2024) */
  getMonths(): Observable<{ value: string; label: string }[]> {
    return this.http.get<{ value: string; label: string }[]>(`${this.apiUrl}/months`);
  }
  
}
