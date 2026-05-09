import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  protected translate = inject(TranslateService);

  isDarkMode = this.themeService.darkMode;
  
  // State
  showNotifications = signal(false);
  showProfileMenu = signal(false);
  showMobileSearch = signal(false);
  searchQuery = signal('');
  notificationCount = signal(3); // Mock count

  // Get user from AuthService (mocked if not found)
  currentUser = signal<User | null>(this.getCurrentUser());

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    this.showNotifications.set(false);
    this.showProfileMenu.set(false);
    // Don't close mobile search on clickout so they can interact with the screen
  }

  private getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    try {
      return userJson ? JSON.parse(userJson) : {
        id: 0,
        name: 'Guest User',
        email: 'guest@example.com',
        roles: ['USER'],
        tenantId: 0,
        branchId: 0
      };
    } catch (e) {
      return null;
    }
  }

  toggleLanguage() {
    const nextLang = this.translate.currentLang === 'en' ? 'ar' : 'en';
    this.languageService.setLanguage(nextLang);
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
    this.showProfileMenu.set(false);
    this.showMobileSearch.set(false);
  }

  toggleProfileMenu() {
    this.showProfileMenu.update(v => !v);
    this.showNotifications.set(false);
    this.showMobileSearch.set(false);
  }

  toggleMobileSearch() {
    this.showMobileSearch.update(v => !v);
    this.showNotifications.set(false);
    this.showProfileMenu.set(false);
  }

  closeMobileSearch() {
    this.showMobileSearch.set(false);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
    this.showNotifications.set(false);
    this.showProfileMenu.set(false);
    this.showMobileSearch.set(false);
  }

  logout() {
    const refreshToken = localStorage.getItem('refresh_token') || '';
    const accessToken = localStorage.getItem('access_token');
    
    localStorage.clear();
    this.currentUser.set(null);
    this.showProfileMenu.set(false);
    
    this.router.navigate(['/login']);

    this.authService.logout(refreshToken, accessToken).subscribe({
      next: () => console.log('Backend logout successful'),
      error: (err) => console.error('Backend logout failed', err)
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
