import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/core/services/auth.service';

export const UserOnlyGuard: CanActivateFn = () => {
	const authService = inject(AuthService);
	const router = inject(Router);

	return authService.getRole() === 'user' ? true : router.createUrlTree(['/dashboard/home']);
};
