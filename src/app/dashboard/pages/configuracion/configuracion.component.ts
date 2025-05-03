import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { UserService } from '@auth/core/services/user.service';
import { ErrorService } from '@auth/core/services/error.service';
import { ToastModule } from 'primeng/toast';
import { ProfileUpdatePayload } from '@auth/core/interfaces/profile-update.interface';

@Component({
	selector: 'app-configuracion',
	standalone: true,
	imports: [CommonModule, InputTextModule, PasswordModule, ButtonModule, FileUploadModule, FormsModule, ToastModule],
	templateUrl: './configuracion.component.html',
	styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
	user = {
		id: 0,
		username: '',
		email: '',
		password: '',
		nuevaPassword: '',
		foto: '',
	};

	loading = false;

	constructor(
		private userService: UserService,
		private errorService: ErrorService,
	) {}

	ngOnInit(): void {
		this.cargarUsuario();
	}

	cargarUsuario(): void {
		this.userService.getProfile().subscribe({
			next: (user) => {
				this.user.id = user.id!;
				this.user.username = user.username;
				this.user.email = user.email;
				this.user.foto = user.photo || '';
			},
			error: (err) => {
				console.error('Error al cargar el perfil:', err);
			},
		});
	}

	guardarCambios() {
		if (!this.user.username || !this.user.email) {
			this.errorService.requiredFields();
			return;
		}

		const payload: ProfileUpdatePayload = {
			username: this.user.username,
			email: this.user.email,
		};

		if (this.user.nuevaPassword) {
			payload.contraseña = this.user.nuevaPassword;
		}

		this.loading = true;
		this.userService.updateProfile(this.user.id, payload).subscribe({
			next: () => {
				this.errorService.updateSuccess();
				const updatedUser = {
					id: this.user.id,
					username: this.user.username,
					email: this.user.email,
				};
				localStorage.setItem('user', JSON.stringify(updatedUser));

				this.user.password = '';
				this.user.nuevaPassword = '';
			},
			error: (err) => {
				console.error('Error al actualizar perfil:', err);
				this.errorService.msjError(err);
			},
			complete: () => {
				this.loading = false;
			},
		});
	}

	onFotoCambiada(event: { files: File[] }) {
		const file = event.files[0];
		if (file) {
			this.user.foto = URL.createObjectURL(file);
		}
	}

	cancelarCambios() {
		this.cargarUsuario(); // ← vuelve a cargar los datos originales
		this.user.nuevaPassword = '';
	}
}
