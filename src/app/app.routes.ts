import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'form',
		loadChildren: () => import('./form/form.routes'),
	},
	{
		path: '',
		redirectTo: '/form/formulario-personal',
		pathMatch: 'full',
	},
	{
		path: '**',
		redirectTo: '/form/formulario-personal',
		pathMatch: 'full',
	},
];
