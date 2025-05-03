import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/core/services/auth.service';

export const RoleGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);

	return authService.getRole() === 'admin' ? true : router.createUrlTree(['/dashboard/user-home']);
};
