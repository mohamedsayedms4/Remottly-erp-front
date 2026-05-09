import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { TRANSLATIONS } from './core/i18n/translations';
import { routes } from './app.routes';

// Bulletproof Inline Loader: Bypasses HTTP, Interceptors, Caching, and Paths completely.
export class InlineTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(TRANSLATIONS[lang] || TRANSLATIONS['ar']);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: InlineTranslateLoader
        },
        fallbackLang: 'ar'
      })
    )
  ],
};
