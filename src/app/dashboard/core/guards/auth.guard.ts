import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isTokenExpired } from '../../../dashboard/core/utils/auth.utils'; // Ojo con la ruta relativa

export const authGuard: CanActivateFn = (_route, _state) => {
	const router = inject(Router);
	const token = localStorage.getItem('token');

	if (!token || isTokenExpired(token)) {
		localStorage.clear();
		router.navigate(['/auth/login']);
		return false;
	}

	return true;
};
