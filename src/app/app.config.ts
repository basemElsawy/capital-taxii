import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { tokenInterceptor } from '../app/Components/guard-interceptor/token.interceptor';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// required for AoT
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideToastr({ timeOut: 2000, positionClass: 'toast-top-right' }),
    provideAnimations(),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([tokenInterceptor]),
      withInterceptorsFromDi()
    ),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!,
  ],
};
