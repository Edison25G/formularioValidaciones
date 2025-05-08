import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { UserService } from '@auth/core/services/user.service';
import { ErrorService } from '@auth/core/services/error.service';
import { User } from '@auth/core/interfaces/user.interfaces';
import { ValidatorUtils } from '../../../utils/validator.utils';
import { CategoryService } from '@dashboard/core/services/categories.service';
import { Categoria } from '@dashboard/core/interfaces/categories.interface'; // Ajusta la ruta según la estructura de tu proyecto
import { Accion } from '@auth/core/interfaces/accion.interface';
import { AuthService } from '@auth/core/services/auth.service';

@Component({
	selector: 'app-usuarios',
	standalone: true,
	templateUrl: './usuarios.component.html',
	styleUrls: ['./usuarios.component.css'],
	imports: [
		CommonModule,
		TableModule,
		DialogModule,
		ToastModule,
		ToolbarModule,
		ConfirmDialogModule,
		ButtonModule,
		InputTextModule,
		FormsModule,
		ReactiveFormsModule,
		IconFieldModule,
		InputIconModule,
		TagModule,
		DropdownModule,
		MultiSelectModule,
	],
	providers: [ConfirmationService, MessageService],
})
export class UsuariosComponent implements OnInit {
	users: User[] = [];
	selectedUsers: User[] = [];
	userForm!: FormGroup;
	showUserModal = false;
	isEditMode = false;
	submitted = false;
	accionesDisponibles: Accion[] = [
		{ label: 'Ver', value: 'ver' },
		{ label: 'Editar', value: 'editar' },
		{ label: 'Subir', value: 'subir' },
		{ label: 'Eliminar', value: 'eliminar' },
		{ label: 'Descargar', value: 'descargar' },
		{ label: 'Imprimir', value: 'imprimir' },
	];

	categorias: Categoria[] = [];

	@ViewChild('dt') dt!: Table;

	constructor(
		private userService: UserService,
		private errorService: ErrorService,
		private fb: FormBuilder,
		private confirmationService: ConfirmationService,
		private messageService: MessageService,
		private cd: ChangeDetectorRef,
		private categoryService: CategoryService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.initForm();
		this.getUsers();
		this.cargarCategorias();
	}

	initForm(): void {
		this.userForm = this.fb.group({
			id: [null],
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: [''],
			role: [{ value: 'user', disabled: true }, Validators.required],
			photo: [''],
			accionesPermitidas: [[]],
			categoriasPermitidas: [[]],
		});
	}

	cargarCategorias(): void {
		this.categoryService.getCategories().subscribe({
			next: (data) => {
				this.categorias = data.map((cat: Categoria) => ({
					id: cat.id,
					name: cat.name,
					slug: cat.slug,
					icon: cat.icon,
				}));
			},
			error: (err) => {
				console.error('Error al cargar categorías:', err);
			},
		});
	}

	getUsers(): void {
		this.userService.getAll().subscribe({
			next: (data) => {
				this.users = data;
				this.cd.markForCheck();
			},
			error: (err) => console.error('Error al obtener usuarios:', err),
		});
	}

	filterGlobal(event: Event, dt: Table) {
		const input = event.target as HTMLInputElement;
		if (input) {
			dt.filterGlobal(input.value, 'contains');
		}
	}

	openUserModal(): void {
		this.userForm.reset({ role: 'user' });
		this.isEditMode = false;
		this.showUserModal = true;
	}

	openEditModal(user: User): void {
		// Acciones seleccionadas
		const accionesSeleccionadas = this.accionesDisponibles.filter((accion) =>
			(user.accionesPermitidas || []).includes(accion.value),
		);

		// Categorías seleccionadas
		const categoriasSeleccionadas = this.categorias.filter(
			(cat) => (user.categoriasPermitidas || []).includes(cat.slug), // Usar `slug` en lugar de `value`
		);

		this.userForm.patchValue({
			...user,
			password: '',
			role: user.role,
			accionesPermitidas: accionesSeleccionadas,
			categoriasPermitidas: categoriasSeleccionadas,
		});

		this.isEditMode = true;
		this.showUserModal = true;
	}

	closeUserModal(): void {
		this.showUserModal = false;
		this.submitted = false;
	}

	saveUser(): void {
		this.submitted = true;

		if (this.userForm.invalid) {
			this.errorService.requiredFields();
			return;
		}

		const { email, password } = this.userForm.value;

		if (!ValidatorUtils.isValidEmail(email)) {
			this.errorService.invalidEmail();
			return;
		}

		if (!ValidatorUtils.isValidPassword(password)) {
			this.errorService.invalidPasswordFormat();
			return;
		}
		this.userForm.value.accionesPermitidas = (this.userForm.value.accionesPermitidas || []).map((a: Accion) => a.value);

		this.userForm.value.categoriasPermitidas = (this.userForm.value.categoriasPermitidas || []).map(
			(cat: Categoria) => cat.slug,
		);

		const payload = {
			...this.userForm.value,
			contraseña: password,
		};
		delete payload.password;

		this.userService.register(payload).subscribe({
			next: () => {
				this.getUsers();
				this.closeUserModal();
				this.errorService.registrationSuccess();
			},
			error: (err) => this.errorService.registrationError(err),
		});
	}

	updateUser(): void {
		this.submitted = true;

		if (this.userForm.invalid) {
			this.errorService.requiredFields();
			return;
		}

		const { id, username, email, password, accionesPermitidas, categoriasPermitidas } = this.userForm.getRawValue();

		if (!ValidatorUtils.isValidEmail(email)) {
			this.errorService.invalidEmail();
			return;
		}

		const cleanAcciones = accionesPermitidas.map((a: Accion) => a.value); // Extraemos el `value` de cada acción
		const cleanCategorias = categoriasPermitidas.map((c: Categoria) => c.slug); // Extraemos el `slug` de cada categoría
		const payload: Partial<User> = {
			username,
			email,
			role: this.userForm.get('role')?.value,
			accionesPermitidas: cleanAcciones,
			categoriasPermitidas: cleanCategorias,
		};

		if (password) {
			if (!ValidatorUtils.isValidPassword(password)) {
				this.errorService.invalidPasswordFormat();
				return;
			}
			payload.contraseña = password;
		}

		this.userService.update(id, payload).subscribe({
			next: () => {
				this.getUsers();
				this.closeUserModal();
				this.messageService.add({
					severity: 'success',
					summary: 'Usuario actualizado',
					detail: `El usuario "${username}" fue actualizado correctamente.`,
					life: 3000,
				});
				this.authService.refreshUserFromBackend();
			},
			error: (err) => {
				this.errorService.registrationError(err);
			},
		});
	}

	deleteUser(id: number): void {
		this.confirmationService.confirm({
			message: '¿Estás seguro de eliminar este usuario?',
			header: 'Confirmar eliminación',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'Sí',
			rejectLabel: 'No',
			acceptButtonStyleClass: 'p-button-danger',
			accept: () => {
				this.userService.delete(id).subscribe({
					next: () => {
						this.getUsers();
						this.errorService.userDeleted();
					},
					error: (err) => {
						console.error('Error al eliminar usuario:', err);
						this.errorService.showError('No se pudo eliminar el usuario.');
					},
				});
			},
		});
	}
}
