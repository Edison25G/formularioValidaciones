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
import { finalize } from 'rxjs/operators';
import { ApiError } from '../../core/types';

@Component({
	selector: 'amc-verify-code',
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
	templateUrl: './verify-code.component.html',
	styleUrls: ['./verify-code.component.css'],
})
export default class VerifyCodeComponent implements OnInit {
	codeForm!: FormGroup;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private errorService: ErrorService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.codeForm = this.fb.group({
			code: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	verify(): void {
		if (this.codeForm.invalid) {
			this.codeForm.markAllAsTouched();
			this.errorService.codeRequired();
			return;
		}

		this.isLoading = true;

		const code = this.codeForm.get('code')?.value;
		const email = localStorage.getItem('resetEmail');

		if (!email) {
			this.isLoading = false;
			this.errorService.resetError('Correo no encontrado. Solicita recuperar contraseña de nuevo.');
			this.router.navigate(['/auth/forgot-password']);
			return;
		}

		this.authService
			.verifyResetCode(email, code)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: () => {
					localStorage.setItem('resetCode', code);
					this.errorService.codeSuccess();
					setTimeout(() => this.router.navigate(['/auth/reset-password']), 1500);
				},
				error: (err: ApiError) => {
					console.error('Error al verificar código:', err);
					this.errorService.resetError(err.error?.message || 'Código inválido');
					this.codeForm.get('code')?.reset();
				},
			});
	}
}
