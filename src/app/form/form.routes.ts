import { Routes } from '@angular/router';

export default [
	{
		path: '',
		loadComponent: () => import('./layout/form-layout.component').then((m) => m.FormLayoutComponent),
		children: [
			{
				path: 'formulario-personal',
				title: 'Formulario de Datos Personales',
				loadComponent: () =>
					import('./pages/formulario-personal/formulario-personal.component').then(
						(m) => m.FormularioPersonalComponent,
					),
			},
			{
				path: '',
				redirectTo: 'formulario-personal',
				pathMatch: 'full',
			},
			{
				path: '**',
				loadComponent: () => import('../common/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
			},
		],
	},
] as Routes;
