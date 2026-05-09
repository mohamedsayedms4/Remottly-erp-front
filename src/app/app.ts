import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LanguageService } from './core/services/language.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
  protected readonly title = signal('remottly-erp');

  constructor() {
    this.languageService.initLanguage();
    this.themeService.initTheme();
  }
}
