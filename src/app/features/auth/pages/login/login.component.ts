import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  protected translate = inject(TranslateService);

  ngOnInit() {
    this.languageService.initLanguage();
  }

  toggleLanguage() {
    const nextLang = this.translate.currentLang === 'en' ? 'ar' : 'en';
    this.languageService.setLanguage(nextLang);
  }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;
  error: string | null = null;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          // Reload to refresh the Header user state or navigate to home
          this.router.navigate(['/home']).then(() => {
             window.location.reload(); // Force reload to refresh signals across components for now
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}
