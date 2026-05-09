import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TenantService } from '../../../../core/services/tenant.service';

@Component({
  selector: 'app-tenant-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tenant-register.component.html',
  styleUrl: './tenant-register.component.css'
})
export class TenantRegisterComponent {
  private fb = inject(FormBuilder);
  private tenantService = inject(TenantService);
  private router = inject(Router);

  registerForm = this.fb.group({
    businessName: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
    adminName: ['', [Validators.required]],
    adminEmail: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    phone: ['', [Validators.required]]
  });

  isLoading = false;
  error: string | null = null;

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      this.tenantService.registerTenant(this.registerForm.value as any).subscribe({
        next: (res) => {
          this.isLoading = false;
          alert('Registration successful! You can now login.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Registration failed. The slug or email might already be taken.';
        }
      });
    }
  }
}
