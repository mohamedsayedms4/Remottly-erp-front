import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TenantRegistration {
  businessName: string;
  slug: string;
  adminName: string;
  adminEmail: string;
  password: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private publicUrl = `${environment.apiUrl}/api/public/tenants`;

  registerTenant(data: TenantRegistration): Observable<any> {
    return this.http.post(`${this.publicUrl}/register`, data);
  }

  resolveSlug(slug: string): Observable<any> {
    return this.http.get(`${this.publicUrl}/resolve/${slug}`);
  }

  findTenantsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicUrl}/find-by-email/${email}`);
  }

  setSelectedTenant(slug: string) {
    localStorage.setItem('selected_tenant_slug', slug);
  }
}
