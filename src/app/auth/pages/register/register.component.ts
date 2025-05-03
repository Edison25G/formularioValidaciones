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
import { User } from '../../core/interfaces/user.interfaces';
import { ErrorService } from '../../core/services/error.service';

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
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css',
})
export default class RegisterComponent implements OnInit {
	registerForm!: FormGroup;
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
		private errorService: ErrorService,
	) {}

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
			confirmPassword: ['', Validators.required],
		});
	}

	register(): void {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			this.errorService.requiredFields();
			return;
		}

		const { password, confirmPassword } = this.registerForm.value;

		if (password !== confirmPassword) {
			this.errorService.passwordsDoNotMatch();
			return;
		}

		const user: User = {
			username: this.registerForm.value.username,
			email: this.registerForm.value.email,
			contraseña: this.registerForm.value.password,
		};

		this.isLoading = true;

		this.userService.register(user).subscribe({
			next: () => {
				this.isLoading = false;
				this.errorService.registrationSuccess();
				this.registerForm.reset();
				setTimeout(() => this.router.navigate(['/auth/login']), 1500);
			},
			error: (e) => {
				this.isLoading = false;
				this.errorService.registrationError(e);
				this.registerForm.reset();
			},
		});
	}
}
