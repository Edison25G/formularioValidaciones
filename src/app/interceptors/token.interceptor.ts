import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../auth/core/services/error.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(
		private router: Router,
		private errorService: ErrorService,
	) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = localStorage.getItem('token');

		if (token) {
			req = req.clone({
				setHeaders: { Authorization: `Bearer ${token}` },
			});
		}

		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				if (error.status === 401) {
					this.errorService.msjError(error);
					this.router.navigate(['/auth/login']);
				}
				return throwError(() => error);
			}),
		);
	}
}
