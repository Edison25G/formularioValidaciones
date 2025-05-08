import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '@dashboard/core/services/dashboard.service';
import { ChartData, ChartOptions } from 'chart.js';
import { User } from '@auth/core/interfaces/user.interfaces';
import { Router } from '@angular/router';
import { Categoria } from '@dashboard/core/interfaces/categories.interface'; // o la ruta correcta según tu proyecto
import { File } from '@dashboard/core/interfaces/file.interface';

@Component({
	selector: 'app-inicio',
	standalone: true,
	imports: [CommonModule, NgFor, ChartModule],
	templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
	totalUsuarios = 0;
	totalCategorias = 0;
	totalArchivos = 0;

	barChartData!: ChartData<'bar'>;
	pieChartData!: ChartData<'pie'>;
	chartOptions!: ChartOptions;
	archivosPorUsuarioChartData!: ChartData<'bar'>;

	categoriasRecientes: Categoria[] = [];
	archivosRecientes: File[] = [];
	user!: User;

	constructor(
		private dashboardService: DashboardService,
		private router: Router,
	) {}

	ngOnInit(): void {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			this.user = JSON.parse(storedUser) as User;
		}

		this.dashboardService.getDashboardData().subscribe((data: DashboardData) => {
			this.totalUsuarios = data.usuarios.length;
			this.totalCategorias = data.categorias.length;
			this.totalArchivos = data.archivos?.length || 0;

			this.categoriasRecientes = data.categorias.slice(0, 4);
			this.archivosRecientes = data.archivos?.slice(0, 4) || [];

			this.pieChartData = {
				labels: data.usuarios.map((user) => user.username),
				datasets: [
					{
						data: data.usuarios.map(() => 1),
						backgroundColor: ['#8B5CF6', '#06b6d4', '#10b981'],
					},
				],
			};

			this.barChartData = {
				labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
				datasets: [
					{
						label: 'Usuarios',
						data: [0, 0, 0, 0, 1, 0, 0],
						backgroundColor: '#6366F1',
					},
				],
			};

			this.chartOptions = {
				responsive: true,
				maintainAspectRatio: false,
			};
		});
	}

	logout(): void {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.router.navigate(['/login']);
	}
}

interface DashboardData {
	usuarios: User[];
	categorias: Categoria[];
	archivos: File[];
}
