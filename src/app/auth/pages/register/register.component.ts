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
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
	selector: 'amc-register',
	standalone: true,
	imports: [
		RouterModule,
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		PasswordModule,
		FloatLabelModule,
		ButtonModule,
		DividerModule,
		MessageModule,
		ToastModule,
		Toast,
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
	providers: [MessageService],
})
export default class RegisterComponent implements OnInit {
	registerForm!: FormGroup;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private messageService: MessageService,
	) {}

	ngOnInit(): void {
		console.log('RegisterComponent inicializado');
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required],
		});
	}

	register(): void {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched(); // Muestra errores
			this.messageService.add({
				severity: 'warn',
				summary: 'Campos obligatorios',
				detail: 'Por favor, completa todos los campos.',
			});
			return;
		}

		const { password, confirmPassword } = this.registerForm.value;

		if (password !== confirmPassword) {
			this.messageService.add({
				severity: 'error',
				summary: 'Contraseña',
				detail: 'Las contraseñas no coinciden.',
			});
			return;
		}

		// const user: User = {
		// 	username: this.registerForm.value.username,
		// 	email: this.registerForm.value.email,
		// 	contraseña: this.registerForm.value.password,
		// };

		// this.userService.register(user).subscribe({
		//   next: () => {
		//     this.messageService.add({
		//       severity: 'success',
		//       summary: 'Registro exitoso',
		//       detail: '¡Ahora puedes iniciar sesión!',
		//     });
		//     setTimeout(() => this.router.navigate(['/auth/login']), 1500);
		//   },
		//   error: (err: any) => {
		//     if (
		//       err?.error?.msg &&
		//       err.error.msg.includes('ya existe')
		//     ) {
		//       this.messageService.add({
		//         severity: 'warn',
		//         summary: 'Registro fallido',
		//         detail: err.error.msg, // muestra: "El usuario Pedro1234 ya existe"
		//       });
		//     } else {
		//       this.messageService.add({
		//         severity: 'error',
		//         summary: 'Error',
		//         detail: 'No se pudo registrar. Intenta de nuevo.',
		//       });
		//     }

		//     console.error('Error en registro:', err);
		//   }

		// });
	}
}
