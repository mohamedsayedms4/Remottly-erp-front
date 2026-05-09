import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { TenantRegisterComponent } from './features/auth/pages/tenant-register/tenant-register.component';
import { HomeComponent } from './features/dashboard/pages/home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register-tenant', component: TenantRegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
