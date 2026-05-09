import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translate = inject(TranslateService);

  setLanguage(lang: 'en' | 'ar') {
    this.translate.use(lang);
    this.updateLayout(lang);
    localStorage.setItem('lang', lang);
  }

  private updateLayout(lang: 'en' | 'ar') {
    const html = document.getElementsByTagName('html')[0];
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    if (lang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }

  initLanguage() {
    const saved = localStorage.getItem('lang') as 'en' | 'ar';
    const lang = saved || 'en';
    this.setLanguage(lang);
  }
}
