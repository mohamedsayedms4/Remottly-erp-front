import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = signal<boolean>(false);

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    this.updateTheme();
  }

  initTheme() {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.darkMode.set(isDark);
    this.updateTheme();
  }

  private updateTheme() {
    const mode = this.darkMode() ? 'dark' : 'light';
    localStorage.setItem('theme', mode);
    
    if (this.darkMode()) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
