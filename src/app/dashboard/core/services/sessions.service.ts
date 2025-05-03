import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '@auth/core/services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class SessionService {
	private timer$: Subscription | null = null;
	private lastActivity = Date.now();

	constructor(
		private authService: AuthService,
		private router: Router,
		private messageService: MessageService,
	) {}

	startWatcher(): void {
		const resetActivityTimer = () => {
			this.lastActivity = Date.now();
		};

		window.addEventListener('mousemove', resetActivityTimer);
		window.addEventListener('keydown', resetActivityTimer);
		window.addEventListener('scroll', resetActivityTimer);
		window.addEventListener('click', resetActivityTimer);

		this.timer$ = interval(10000).subscribe(() => {
			const token = this.authService.getToken();
			if (!token) return;

			const payload: { exp: number } = JSON.parse(atob(token.split('.')[1]));
			const expiracion = payload.exp * 1000;
			const tiempoRestante = expiracion - Date.now();
			const tiempoInactivo = Date.now() - this.lastActivity;

			if (tiempoRestante <= 0) {
				console.warn('Token expirado. Cerrando sesión...');
				this.logoutAndRedirect('expirado');
				return;
			}

			if (tiempoInactivo >= 3 * 60 * 1000) {
				console.warn('Usuario inactivo por 3 minutos. Cerrando sesión...');
				this.logoutAndRedirect('inactividad');
			}
		});
	}

	private logoutAndRedirect(motivo: 'expirado' | 'inactividad'): void {
		this.authService.logout();
		this.router.navigate(['/login']);
		this.stopWatcher();

		this.messageService.add({
			severity: 'warn',
			summary: 'Sesión cerrada',
			detail: motivo === 'expirado' ? 'Tu sesión ha expirado.' : 'Tu sesión fue cerrada por inactividad.',
		});
	}

	stopWatcher(): void {
		this.timer$?.unsubscribe();
	}
}
