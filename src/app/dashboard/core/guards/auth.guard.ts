import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
	const router = inject(Router);
	const token = localStorage.getItem('token');

	if (!token) {
		localStorage.clear();
		router.navigate(['/auth/login']);
		return false;
	}

	return true;
};
