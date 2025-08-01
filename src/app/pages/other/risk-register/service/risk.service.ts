import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Testimonial } from '../../testimonials/service/testimonial.model';

export interface Risk {
  created_at?: string;
  value: string; // e.g., "2024-07"
  label: string; // e.g., "July 2024"
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class RiskService {

  private apiUrl = 'http://localhost:4000/api/risk-register';
    
      constructor(private http: HttpClient) {}
    
      getRiskRegister(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
      }
    
     addRisk(formData: FormData) {
      return this.http.post(`${this.apiUrl}`, formData);
    }
    
     deleteRisk(serial_no: string): Observable<any> {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
        return this.http.delete(`${this.apiUrl}/${serial_no}`, { headers });
      }

      updateRisk(rr_id: string, updatedData: any): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.put(`${this.apiUrl}/${rr_id}`, updatedData, { headers });
      }
    
       /** Get regions list from server */
      getRegions(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/regions`);
      }
    
// Get month
getMonths(): Observable<Risk[]> {
  return this.http.get<Risk[]>(`${this.apiUrl}/months`);
}
}
