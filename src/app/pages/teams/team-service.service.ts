import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamServiceService {

  private apiBaseUrl = 'http://localhost:4000/api/team';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiBaseUrl}`, { headers });
  }
  getTeamById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiBaseUrl}/${id}`);
}

  addTeamMember(teamForm: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log("-------AddTeamFor---------");
    return this.http.post(`${this.apiBaseUrl}/add-team-member`, teamForm, { headers });
  }

  deleteTeam(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiBaseUrl}/${id}`, { headers });
  }

  updateTeam(id: string, updatedData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.apiBaseUrl}/${id}`, updatedData, { headers });
  }

  getRegions(): Observable<any> {
  return this.http.get('http://localhost:4000/api/team/region'); 
}

getSkillsByTeamId(id: number): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any[]>(`http://localhost:4000/api/team/skills/${id}`, { headers });
}
checkEmpIdExists(empId: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.apiBaseUrl}/check-empid/${empId}`);
}

}
