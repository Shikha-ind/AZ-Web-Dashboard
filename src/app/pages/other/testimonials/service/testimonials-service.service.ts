import { Injectable } from '@angular/core';
import { Testimonial } from './testimonial.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsServiceService {
private apiUrl = 'http://localhost:4000/api/testimonials';

  constructor(private http: HttpClient) {}

  /** Fetch all testimonials */
  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(this.apiUrl);
  }

  /** Add a new testimonial */
 addTestimonial(data: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}`, data);
}

  /** Get regions list from server */
  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }

  /** Get service types list from server */
  getServiceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/service-types`);
  }

  /** Like a testimonial */
toggleLike(userId: number, t_id: number): Observable<{ liked: boolean }> {
  const body = { user_id: userId, t_id: t_id };
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post<{ liked: boolean }>(`${this.apiUrl}/like`, body, { headers });
}

// Get month
getMonths(): Observable<Testimonial[]> {
  return this.http.get<Testimonial[]>(`${this.apiUrl}/months`);
}


}
