import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '@auth/core/services/auth.service';
import { FooterComponent } from '@common/components';
import { CategoryService } from '@dashboard/core/services/categories.service';
import { MenuService } from '@dashboard/core/services/menu.service';
import { SessionService } from '@dashboard/core/services/sessions.service';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';

@Component({
	selector: 'amc-dashboard-layout',
	standalone: true,
	imports: [RouterOutlet, CommonModule, RouterModule, PopoverModule, FooterComponent, TreeModule],
	templateUrl: './dashboard-layout.component.html',
	styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit {
	menuOpen = false;
	isMobile = false;
	menuItemsTree: TreeNode[] = [];
	user = {
		username: '',
		role: '',
		categoriasPermitidas: [] as string[],
		accionesPermitidas: [] as string[],
	};

	constructor(
		private router: Router,
		private authService: AuthService,
		private categoryService: CategoryService,
		private menuService: MenuService,
		private sessionService: SessionService,
	) {}

	ngOnInit(): void {
		this.sessionService.startWatcher();
		this.user = {
			username: this.authService.getUsername(),
			role: this.authService.getRole(),
			categoriasPermitidas: this.authService.getCategorias(),
			accionesPermitidas: this.authService.getAcciones(),
		};

		this.checkScreen();
		this.cargarMenu();

		this.menuService.menuTrigger$.subscribe((recargar) => {
			if (recargar) {
				this.cargarMenu();
			}
		});
	}

	private cargarMenu(): void {
		const isAdmin = this.user.role === 'admin';

		this.categoryService.getCategoriesTree().subscribe((categorias) => {
			const categoriasTree = this.formatearCategoriasTree(categorias);
			this.menuItemsTree = [
				{
					label: 'Inicio',
					icon: 'pi pi-home',
					data: isAdmin ? '/dashboard/home' : '/dashboard/user-home',
				},
				...(isAdmin
					? [
							{ label: 'Usuarios', icon: 'pi pi-users', data: '/dashboard/users' },
							{ label: 'Gestionar Categorías', icon: 'pi pi-tags', data: '/dashboard/gestionar-categorias' },
						]
					: []),
				{ label: 'Archivos', icon: 'pi pi-folder', data: '/dashboard/archivos' },
				{ label: 'Configuración', icon: 'pi pi-cog', data: '/dashboard/configuracion' },
				...categoriasTree,
			];
		});
	}

	private formatearCategoriasTree(categorias: any[]): TreeNode[] {
		const isAdmin = this.user.role === 'admin';

		return categorias
			.filter((cat) => isAdmin || this.user.categoriasPermitidas.includes(cat.slug))
			.map((cat) => ({
				label: cat.name,
				icon: cat.icon || 'pi pi-folder',
				data: `/dashboard/categoria/${cat.slug}`,
				children: cat.subcategories ? this.formatearCategoriasTree(cat.subcategories) : [],
			}));
	}

	navegar(event: any): void {
		const link = event.node.data;
		if (link) {
			this.menuOpen = false;
			this.router.navigate([link]);
		}
	}

	logout(): void {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

	@HostListener('window:resize', [])
	checkScreen(): void {
		this.isMobile = window.innerWidth < 1024;
		if (!this.isMobile) {
			this.menuOpen = false;
		}
	}
}
