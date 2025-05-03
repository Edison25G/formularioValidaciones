import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '@dashboard/core/services/categories.service';
import { Categoria } from '@dashboard/core/interfaces/categories.interface';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuService } from '@dashboard/core/services/menu.service';

@Component({
	selector: 'amc-gestionar-categorias',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, TableModule, InputTextModule, ButtonModule, ToastModule, SelectModule],
	templateUrl: './gestionar-categorias.component.html',
	styleUrls: ['./gestionar-categorias.component.css'],
	providers: [MessageService],
})
export class GestionarCategoriasComponent implements OnInit {
	formCategoria!: FormGroup;
	categorias: Categoria[] = [];
	editando = false;
	categoriaEditando: Categoria | null = null;

	iconosDisponibles = [
		{ label: 'Carpeta', value: 'pi pi-folder' },
		{ label: 'Ahorro', value: 'pi pi-wallet' },
		{ label: 'Dinero', value: 'pi pi-money-bill' },
		{ label: 'Gráfico', value: 'pi pi-chart-line' },
		{ label: 'Usuarios', value: 'pi pi-users' },
		{ label: 'Crédito', value: 'pi pi-credit-card' },
		{ label: 'Calendario', value: 'pi pi-calendar-times' },
		{ label: 'Cumplimiento', value: 'pi pi-check-square' },
		{ label: 'Archivo', value: 'pi pi-briefcase' },
		{ label: 'Proveedor', value: 'pi pi-truck' },
		{ label: 'Obligación', value: 'pi pi-exclamation-triangle' },
		{ label: 'Nómina', value: 'pi pi-id-card' },
		{ label: 'Libro', value: 'pi pi-book' },
		{ label: 'Plan estratégico', value: 'pi pi-globe' },
		{ label: 'Presupuesto', value: 'pi pi-calculator' },
	];

	constructor(
		private fb: FormBuilder,
		private categoryService: CategoryService,
		private msg: MessageService,
		private menuService: MenuService,
	) {}

	ngOnInit(): void {
		this.formCategoria = this.fb.group({
			name: ['', Validators.required],
			slug: ['', Validators.required],
			icon: ['pi pi-folder', Validators.required],
		});

		this.obtenerCategorias();

		this.formCategoria.get('name')?.valueChanges.subscribe((valor: string) => {
			if (!this.editando) {
				const slug = valor
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '');

				this.formCategoria.get('slug')?.setValue(slug, { emitEvent: false });
			}
		});
	}

	obtenerCategorias(): void {
		this.categoryService.getCategories().subscribe({
			next: (res) => (this.categorias = res),
			error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías' }),
		});
	}

	guardarCategoria(): void {
		if (this.formCategoria.invalid) return;

		const datos = this.formCategoria.value;

		if (this.editando && this.categoriaEditando) {
			// Actualizar
			const actualizada = { ...this.categoriaEditando, ...datos };
			this.categoryService.actualizarCategoria(actualizada).subscribe({
				next: () => {
					this.msg.add({ severity: 'success', summary: 'Actualizado', detail: 'Categoría actualizada' });
					this.resetFormulario();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar' }),
			});
		} else {
			// Crear
			this.categoryService.crearCategoria(datos).subscribe({
				next: () => {
					this.msg.add({ severity: 'success', summary: 'Creada', detail: 'Categoría creada correctamente' });
					this.resetFormulario();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la categoría' }),
			});
		}
	}

	editar(categoria: Categoria): void {
		this.formCategoria.setValue({
			name: categoria.name,
			slug: categoria.slug,
			icon: categoria.icon,
		});
		this.categoriaEditando = categoria;
		this.editando = true;
	}

	eliminar(categoria: Categoria): void {
		if (confirm(`¿Estás seguro de eliminar la categoría "${categoria.name}"?`)) {
			this.categoryService.eliminarCategoria(categoria.id).subscribe({
				next: () => {
					this.msg.add({ severity: 'success', summary: 'Eliminada', detail: 'Categoría eliminada' });
					this.obtenerCategorias();
				},
				error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' }),
			});
		}
	}

	resetFormulario(): void {
		this.formCategoria.reset({ icon: 'pi pi-folder' });
		this.editando = false;
		this.categoriaEditando = null;
	}
}
