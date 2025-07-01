import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { DialogService } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes, withHashLocation()),
		provideAnimationsAsync(),
		provideHttpClient(),

		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: '.my-app-dark',
				},
			},
		}),
		MessageService,
		DialogService,
	],
};
