import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { Toast } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

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
		Toast,
	],
	providers: [MessageService],
})
export default class LoginComponent {
	private fb = inject(FormBuilder);

	public loginForm = this.fb.nonNullable.group({
		username: ['', [Validators.required]],
		password: ['', [Validators.required]],
	});

	onLogin(): void {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		console.log(this.loginForm.getRawValue());

		//const credentials = this.loginForm.value;

		// this.userService.login(credentials).subscribe({
		//   next: () => {
		//     this.messageService.add({
		//       severity: 'success',
		//       summary: 'Bienvenido',
		//       detail: 'Inicio de sesión exitoso',
		//     });
		//     setTimeout(() => this.router.navigate(['/dashboard/home']), 1500);
		//   },
		//   error: (err: any) => {
		//     this.messageService.add({
		//       severity: 'error',
		//       summary: 'Error',
		//       detail: 'Credenciales inválidas',
		//     });
		//     console.error(err);
		//   },
		// });
	}
}
