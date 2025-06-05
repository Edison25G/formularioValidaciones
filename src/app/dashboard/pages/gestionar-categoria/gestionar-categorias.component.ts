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
	// Categorías padre
	categorias: Categoria[] = [];
	formCategoria!: FormGroup;
	categoriasPadre: Categoria[] = [];
	editando = false;
	categoriaEditando: Categoria | null = null;

	// Subcategorías
	formSubcategoria!: FormGroup;
	subCategorias: Categoria[] = [];
	editandoSubcategoria = false;
	subcategoriaEditando: Categoria | null = null;

	iconosDisponibles = [
		{ label: 'Ahorros', value: 'pi pi-wallet' },
		{ label: 'Créditos', value: 'pi pi-credit-card' },
		{ label: 'Inversiones', value: 'pi pi-chart-line' },
		{ label: 'Pagos', value: 'pi pi-money-bill' },
		{ label: 'Usuarios', value: 'pi pi-users' },
		{ label: 'Proveedores', value: 'pi pi-truck' },
		{ label: 'Presupuesto', value: 'pi pi-calculator' },
		{ label: 'Archivo Documental', value: 'pi pi-briefcase' },
		{ label: 'Cumplimiento', value: 'pi pi-check-square' },
		{ label: 'Notificaciones', value: 'pi pi-bell' },
		{ label: 'Gestión de Personal', value: 'pi pi-id-card' },
		{ label: 'Educación Financiera', value: 'pi pi-book' },
		{ label: 'Planificación Estratégica', value: 'pi pi-globe' },
		{ label: 'Eventos', value: 'pi pi-calendar' },
		{ label: 'Obligaciones Legales', value: 'pi pi-exclamation-triangle' },
		{ label: 'Soporte Técnico', value: 'pi pi-question-circle' },
		{ label: 'Inicio', value: 'pi pi-home' },
		{ label: 'Configuración', value: 'pi pi-cog' },
		{ label: 'Seguridad', value: 'pi pi-lock' },
		{ label: 'Reuniones', value: 'pi pi-comments' },
		{ label: 'Indicadores', value: 'pi pi-chart-bar' },
		{ label: 'Auditoría', value: 'pi pi-eye' },
		{ label: 'Legal', value: 'pi pi-briefcase' },
		{ label: 'Reportes', value: 'pi pi-file' },
		{ label: 'Contabilidad', value: 'pi pi-file-edit' },
		{ label: 'Sucursal', value: 'pi pi-building' },
		{ label: 'Tiempo', value: 'pi pi-clock' },
		{ label: 'Mensajes', value: 'pi pi-envelope' },
		{ label: 'Tareas', value: 'pi pi-list' },
		{ label: 'Contacto', value: 'pi pi-phone' },
	];

	constructor(
		private fb: FormBuilder,
		private categoryService: CategoryService,
		private msg: MessageService,
		private menuService: MenuService,
	) {}

	ngOnInit(): void {
		// Formulario Categorías
		this.formCategoria = this.fb.group({
			name: ['', Validators.required],
			slug: ['', Validators.required],
			icon: ['pi pi-folder', Validators.required],
		});

		// Formulario Subcategorías
		this.formSubcategoria = this.fb.group({
			name: ['', Validators.required],
			slug: ['', Validators.required],
			parent_id: [null, Validators.required], // obligatorio elegir categoría padre
		});

		this.obtenerCategorias();

		// Auto-slug categorías
		this.formCategoria.get('name')?.valueChanges.subscribe((valor: string | null) => {
			if (!this.editando && typeof valor === 'string' && valor) {
				const slug = valor
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '');
				this.formCategoria.get('slug')?.setValue(slug, { emitEvent: false });
			}
		});

		// Auto-slug subcategorías
		this.formSubcategoria.get('name')?.valueChanges.subscribe((valor: string | null) => {
			if (!this.editandoSubcategoria && typeof valor === 'string' && valor) {
				const slug = valor
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^a-z0-9-]/g, '');
				this.formSubcategoria.get('slug')?.setValue(slug, { emitEvent: false });
			}
		});
	}

	obtenerCategorias(): void {
		this.categoryService.getCategories().subscribe({
			next: (res) => {
				this.categorias = res;
				this.categoriasPadre = this.categorias.filter((cat) => !cat.parent_id);
				this.subCategorias = this.categorias.filter((cat) => !!cat.parent_id);
			},
			error: () => this.msg.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías' }),
		});
	}

	// Categorías
	guardarCategoria(): void {
		if (this.formCategoria.invalid) return;

		const datos = this.formCategoria.value;

		if (this.editando && this.categoriaEditando) {
			const actualizada = { ...this.categoriaEditando, ...datos, parent_id: null };
			this.categoryService.actualizarCategoria(actualizada).subscribe({
				next: () => {
					this.msg.add({
						severity: 'success',
						summary: 'Actualizado',
						detail: 'Categoría actualizada',
					});
					this.resetFormulario();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo actualizar',
					}),
			});
		} else {
			this.categoryService.crearCategoria(datos).subscribe({
				next: () => {
					this.msg.add({
						severity: 'success',
						summary: 'Creada',
						detail: 'Categoría creada correctamente',
					});
					this.resetFormulario();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo crear la categoría',
					}),
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
					this.msg.add({
						severity: 'success',
						summary: 'Eliminada',
						detail: 'Categoría eliminada',
					});
					this.obtenerCategorias();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo eliminar',
					}),
			});
		}
	}

	resetFormulario(): void {
		this.formCategoria.reset({ icon: 'pi pi-folder' });
		this.editando = false;
		this.categoriaEditando = null;
	}

	// Subcategorías
	guardarSubcategoria(): void {
		if (this.formSubcategoria.invalid) return;

		const datos = this.formSubcategoria.value;

		if (this.editandoSubcategoria && this.subcategoriaEditando) {
			const actualizada = { ...this.subcategoriaEditando, ...datos };
			this.categoryService.actualizarCategoria(actualizada).subscribe({
				next: () => {
					this.msg.add({
						severity: 'success',
						summary: 'Actualizado',
						detail: 'Subcategoría actualizada',
					});
					this.resetFormularioSubcategoria();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo actualizar',
					}),
			});
		} else {
			this.categoryService.crearCategoria(datos).subscribe({
				next: () => {
					this.msg.add({
						severity: 'success',
						summary: 'Creada',
						detail: 'Subcategoría creada correctamente',
					});
					this.resetFormularioSubcategoria();
					this.obtenerCategorias();
					this.menuService.dispararRecarga();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo crear la subcategoría',
					}),
			});
		}
	}

	editarSubcategoria(subcat: Categoria): void {
		this.formSubcategoria.setValue({
			name: subcat.name,
			slug: subcat.slug,
			icon: subcat.icon,
			parent_id: subcat.parent_id,
		});
		this.subcategoriaEditando = subcat;
		this.editandoSubcategoria = true;
	}

	eliminarSubcategoria(subcat: Categoria): void {
		if (confirm(`¿Estás seguro de eliminar la subcategoría "${subcat.name}"?`)) {
			this.categoryService.eliminarCategoria(subcat.id).subscribe({
				next: () => {
					this.msg.add({
						severity: 'success',
						summary: 'Eliminada',
						detail: 'Subcategoría eliminada',
					});
					this.obtenerCategorias();
				},
				error: () =>
					this.msg.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo eliminar',
					}),
			});
		}
	}

	resetFormularioSubcategoria(): void {
		this.formSubcategoria.reset({ icon: 'pi pi-folder', parent_id: null });
		this.editandoSubcategoria = false;
		this.subcategoriaEditando = null;
	}

	getNombreCategoriaPadre(parent_id: number | null): string {
		if (!parent_id) return '-';
		const categoriaPadre = this.categoriasPadre.find((cat) => cat.id === parent_id);
		return categoriaPadre ? categoriaPadre.name : '-';
	}
}
