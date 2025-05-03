import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ErrorService } from '../../core/services/error.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'amc-forgot-password',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ReactiveFormsModule,
		InputTextModule,
		FloatLabelModule,
		ButtonModule,
		ToastModule,
	],
	providers: [MessageService],
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css'],
})
export default class ForgotPasswordComponent implements OnInit {
	forgotForm!: FormGroup;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private errorService: ErrorService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.forgotForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
		});
	}

	recoverPassword(): void {
		if (this.forgotForm.invalid) {
			this.forgotForm.markAllAsTouched();
			this.errorService.resetError('Ingresa un correo válido.');
			return;
		}

		this.isLoading = true;
		const email = this.forgotForm.value.email;
		this.authService.sendResetCode(email).subscribe({
			next: () => {
				this.isLoading = false;
				localStorage.setItem('resetEmail', email);
				this.errorService.forgotSuccess();
				this.forgotForm.reset();

				setTimeout(() => this.router.navigate(['/auth/verify-code']), 2000);
			},
			error: (err) => {
				this.isLoading = false;
				console.error(err);
				if (err?.error?.message === 'Correo no encontrado') {
					this.errorService.resetError('Correo no encontrado.');
				} else {
					this.errorService.resetError('No se pudo enviar el código. Intenta de nuevo.');
				}
			},
		});
	}
}
