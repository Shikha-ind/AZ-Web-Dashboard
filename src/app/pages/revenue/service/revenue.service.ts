import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Revenue {
  region: string;
  onsite_revenue: number;
  onsite_hc: number;
  offshore_revenue: number;
  offshore_hc: number;
  ideal_hc_nearshore: number;
  ideal_hc_offshore: number;
  excess_offshore: number;
  excess_nearshore: number;
  canada_fte: number;
  uk_fte: number;
  uk_catalog: number;
  ceeba_hcp: number;
  wese_catalog: number;
  canada_catalog: number;
  plan_of_action: string;
  created_at?: string;
  value: string; 
  label: string; 
}



@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private apiUrl = 'http://localhost:4000/api/revenue';

  constructor(private http: HttpClient) {}

  // Create new revenue record
  createRevenue(data: Revenue): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  //  Get all revenue records
  getRevenue(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl); // Replace with actual backend URL
}

  // Update by ID
  updateRevenue(id: number, data: Revenue): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  //  Delete by ID
  deleteRevenue(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }

  getMonths(): Observable<Revenue[]> {
    return this.http.get<Revenue[]>(`${this.apiUrl}/months`);
  }
}
