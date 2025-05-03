import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../core/services/error.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '@auth/core/services/auth.service';
import { ApiError } from '../../core/types';

@Component({
	selector: 'amc-reset-password',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		PasswordModule,
		FloatLabelModule,
		ButtonModule,
		ToastModule,
	],
	providers: [MessageService],
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css'],
})
export default class ResetPasswordComponent implements OnInit {
	resetForm!: FormGroup;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private errorService: ErrorService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.resetForm = this.fb.group({
			newPassword: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required],
		});
	}

	resetPassword(): void {
		if (this.resetForm.invalid) {
			this.resetForm.markAllAsTouched();
			this.errorService.requiredFields();
			return;
		}

		const { newPassword, confirmPassword } = this.resetForm.value;

		if (newPassword !== confirmPassword) {
			this.errorService.resetError('Las contraseñas deben ser iguales.');
			this.resetForm.get('newPassword')?.reset();
			this.resetForm.get('confirmPassword')?.reset();
			return;
		}

		const email = localStorage.getItem('resetEmail');
		const code = localStorage.getItem('resetCode');

		if (!email || !code) {
			this.errorService.resetError('Datos inválidos. Solicita recuperar contraseña de nuevo.');
			this.router.navigate(['/auth/forgot-password']);
			return;
		}

		this.isLoading = true;

		this.authService
			.resetPassword(email, code, newPassword)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: () => {
					this.errorService.resetSuccess();
					this.resetForm.reset();
					localStorage.removeItem('resetEmail');
					localStorage.removeItem('resetCode');

					setTimeout(() => this.router.navigate(['/auth/login']), 2000);
				},
				error: (err: ApiError) => {
					console.error('Error al restablecer contraseña:', err);
					this.errorService.resetError(err.error?.message || 'No se pudo restablecer la contraseña.');
				},
			});
	}
}
