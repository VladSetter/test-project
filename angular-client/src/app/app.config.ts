import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LoginService } from './login.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(LoginService).restoreSessionFromStorage()
    }
  ]
};
