import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./layout/auth-layout.component'),
		children: [
			{
				path: 'login',
				title: 'Login',
				loadComponent: () => import('./pages/login/login.component'),
			},
			{
				path: 'register',
				title: 'Register',
				loadComponent: () => import('./pages/register/register.component'),

			},
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},
			{
				path: '**',
				loadComponent: () => import('../common/pages/not-found/not-found.component'),
			},
		],
	},
] as Routes;
