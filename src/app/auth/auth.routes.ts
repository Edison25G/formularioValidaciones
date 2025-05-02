import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./layout/auth-layout.component'),
		children: [
			{
				path: 'login',
				title: 'Inicio de sesión',
				loadComponent: () => import('./pages/login/login.component'),
			},
			{
				path: 'register',
				title: 'Registro de usuario',
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
