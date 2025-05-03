import { Component, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
//import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PopoverModule } from 'primeng/popover';
import { AuthService } from '@auth/core/services/auth.service';
import { ScrollerModule } from 'primeng/scroller';
import { FooterComponent } from '@common/components';
import { CategoryService } from '@dashboard/core/services/categories.service';
import { MenuService } from '@dashboard/core/services/menu.service';
import { SessionService } from '@dashboard/core/services/sessions.service';

@Component({
	selector: 'amc-dashboard-layout',
	standalone: true,
	imports: [RouterOutlet, CommonModule, RouterModule, PopoverModule, ScrollerModule, FooterComponent],
	templateUrl: './dashboard-layout.component.html',
	styleUrls: ['./dashboard-layout.component.css'],
})
export class DashboardLayoutComponent implements OnInit {
	menuOpen = false;
	isMobile = false;
	menuItems!: MenuItem[];

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

		const baseItems: MenuItem[] = [
			{
				label: 'Inicio',
				icon: 'pi pi-home',
				routerLink: isAdmin ? '/dashboard/home' : '/dashboard/user-home',
			},
			...(isAdmin
				? [
						{ label: 'Usuarios', icon: 'pi pi-users', routerLink: '/dashboard/users' },
						{
							label: 'Gestionar Categorías',
							icon: 'pi pi-tags',
							routerLink: '/dashboard/gestionar-categorias',
						},
					]
				: []),
			{ label: 'Archivos', icon: 'pi pi-folder', routerLink: '/dashboard/archivos' },
			{ label: 'Configuración', icon: 'pi pi-cog', routerLink: '/dashboard/configuracion' },
		];

		this.categoryService.getCategories().subscribe((categorias: { name: string; slug: string; icon: string }[]) => {
			const categoriasMenu: MenuItem[] = categorias
				.filter((cat) => isAdmin || this.user.categoriasPermitidas.includes(cat.slug))
				.map((cat) => ({
					label: cat.name,
					icon: cat.icon || 'pi pi-folder',
					routerLink: `/dashboard/categoria/${cat.slug}`,
				}));

			this.menuItems = [...baseItems, ...categoriasMenu];
		});
	}

	private formatearNombre(slug: string): string {
		return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
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
