import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  tenantId: number;
  branchId: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // Using explicit API URL as requested for the endpoint base
  private apiUrl = `http://localhost:8080/api/v1/auth`;

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          this.saveTokens(res.data.accessToken, res.data.refreshToken);
          this.saveUser(res.data.user);
        }
      })
    );
  }

  logout(refreshToken: string, accessToken?: string | null): Observable<any> {
    let headers = new HttpHeaders();
    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }
    
    // Hitting POST http://localhost:8080/api/v1/auth/logout exactly as requested
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken }, { headers }).pipe(
      tap(() => this.clearStorage())
    );
  }

  refreshToken(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken: token });
  }

  private saveTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  private saveUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearStorage() {
    localStorage.clear();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getTenantId(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.tenantId.toString();
    }
    return localStorage.getItem('selected_tenant_slug');
  }
}
