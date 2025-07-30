import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface Role {
  id: number;
  role: string;
  emailId: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/users';

  constructor(private http: HttpClient) {}

  

  // getUserId(): number | null {
  //   const token = localStorage.getItem('token');
  //   if (!token) return null;

  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     return payload.emailId; // or whatever your token payload contains
  //   } catch (e) {
  //     return null;
  //   }
  // }
  getUserId(): number | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.emailId;
  } catch {
    return null;
  }
}

  // Get all roles from backend
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

//  getUser(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/`);
//   }
  

  //  Register a new user
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  // Login user
  login(credentials: { emailId: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
  }

  // Check if the user has team lead role
  // isTeamLead(): boolean {
  //   const token = localStorage.getItem('token');
  //   if (!token) return false;

  //   try {
  //     const decoded: any = jwtDecode(token);
  //     return decoded.role === 'team_lead';
  //   } catch {
  //     return false;
  //   }
  // }

 

  // Add team member (protected)
  // addTeamMember(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/members`, data);
  // }
}
