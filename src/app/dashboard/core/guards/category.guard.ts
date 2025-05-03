import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const categoryGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
	const router = inject(Router);

	const user = JSON.parse(localStorage.getItem('user') || '{}') as {
		role: 'admin' | 'user';
		categoriasPermitidas: string[];
	};

	const categoria = route.params['nombre'];

	if (!categoria) {
		router.navigate(['/dashboard/user-home']);
		return false;
	}

	if (user.role === 'admin') {
		return true;
	}

	if ((user.categoriasPermitidas || []).includes(categoria)) {
		return true;
	}

	router.navigate(['/dashboard/user-home']);
	return false;
};
