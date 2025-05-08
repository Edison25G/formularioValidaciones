import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { RoleGuard } from '../auth/core/guards/role.guard';
import { categoryGuard } from './core/guards/category.guard';
import { UserOnlyGuard } from '../auth/core/guards/user-only.guard';
export default [
	{
		path: '',
		loadComponent: () => import('./layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
		canActivate: [authGuard],
		children: [
			{
				path: 'home',
				loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent),
				canActivate: [RoleGuard],
			},
			{
				path: 'user-home',
				loadComponent: () =>
					import('./pages/inicio-second/inicio-second.component').then((m) => m.InicioSecondComponent),
				canActivate: [UserOnlyGuard],
			},
			{
				path: 'gestionar-categorias',
				loadComponent: () =>
					import('./pages/gestionar-categoria/gestionar-categorias.component').then(
						(m) => m.GestionarCategoriasComponent,
					),
				canActivate: [RoleGuard],
			},
			{
				path: 'users',
				loadComponent: () => import('./pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
				canActivate: [RoleGuard],
			},
			{
				path: 'archivos',
				loadComponent: () => import('./pages/archivos/archivos.component').then((m) => m.ArchivosComponent),
			},
			{
				path: 'configuracion',
				loadComponent: () =>
					import('./pages/configuracion/configuracion.component').then((m) => m.ConfiguracionComponent),
			},
			{
				path: 'categoria/:nombre',
				loadComponent: () =>
					import('./pages/categoriaDocumentos/categoria-documentos.component').then(
						(m) => m.CategoriaDocumentosComponent,
					),
				canActivate: [categoryGuard],
			},
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{
				path: '**',
				loadComponent: () => import('../common/pages/not-found/not-found.component').then((m) => m.default),
			},
		],
	},
] as Routes;
