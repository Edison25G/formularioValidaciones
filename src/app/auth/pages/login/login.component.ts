import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../core/services/error.service';
import { AuthService } from '@auth/core/services/auth.service';

@Component({
	selector: 'amc-login',
	standalone: true,
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		InputTextModule,
		PasswordModule,
		FloatLabelModule,
		ButtonModule,
		DividerModule,
		ToastModule,
		MessageModule,
	],
	providers: [MessageService],
})
export default class LoginComponent implements OnInit {
	loginForm!: FormGroup;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private errorService: ErrorService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			username: ['', Validators.required],
			contraseña: ['', Validators.required],
		});
	}

	login(): void {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			this.errorService.requiredFields();
			return;
		}

		this.isLoading = true;
		const credentials = this.loginForm.value;

		this.userService.login(credentials).subscribe({
			next: ({ token }) => {
				this.authService.saveToken(token);

				// 2. Obtener datos del usuario desde /me
				this.authService.getProfile().subscribe({
					next: (user) => {
						this.isLoading = false;

						// 3. Guardar datos del usuario (solo lo necesario)
						this.authService.saveUserSession({
							username: user.username,
							role: user.role!,
							accionesPermitidas: user.accionesPermitidas || [],
							categoriasPermitidas: user.categoriasPermitidas || [],
						});

						// 4. Mostrar éxito y redireccionar
						this.errorService.loginSuccess();
						const ruta = user.role === 'admin' ? '/dashboard/home' : '/dashboard/user-home';
						setTimeout(() => this.router.navigate([ruta]), 1000);
					},
					error: () => {
						this.isLoading = false;
						this.errorService.showError('Error al obtener perfil del usuario');
					},
				});
			},
			error: (err) => {
				this.isLoading = false;
				this.errorService.loginError(err);
				this.loginForm.reset();
			},
		});
	}
}
