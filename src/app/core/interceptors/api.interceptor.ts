import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();
  const tenantId = authService.getTenantId();

  // Skip adding headers for local assets (i18n files)
  if (req.url.includes('/assets/')) {
    return next(req);
  }

  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (tenantId) {
    headers = headers.set('X-Tenant-ID', tenantId);
  }

  const apiReq = req.clone({ headers });
  return next(apiReq);
};
