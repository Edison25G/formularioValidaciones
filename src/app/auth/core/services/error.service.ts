import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiError } from '../types';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	constructor(private messageService: MessageService) {}

	// === GENERALES ===
	requiredFields(): void {
		this.messageService.add({
			severity: 'warn',
			summary: 'Campos requeridos',
			detail: 'Por favor, completa todos los campos.',
		});
	}

	passwordsDoNotMatch(): void {
		this.messageService.add({
			severity: 'error',
			summary: 'Contraseña',
			detail: 'Las contraseñas no coinciden.',
		});
	}

	codeRequired(): void {
		this.messageService.add({
			severity: 'warn',
			summary: 'Código requerido',
			detail: 'Por favor, ingresa el código que recibiste por correo.',
		});
	}

	// === REGISTER ===
	registrationSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Registro exitoso',
			detail: '¡Ahora puedes iniciar sesión!',
		});
	}

	registrationError(error: ApiError): void {
		if (error?.error?.msg?.includes('ya existe')) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Registro fallido',
				detail: error.error.msg,
			});
		} else {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'No se pudo registrar. Comuniquese con el administrador.',
			});
		}
	}

	// === LOGIN ===
	loginSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Bienvenido',
			detail: 'Inicio de sesión exitoso',
		});
	}

	loginError(error: ApiError): void {
		const msg = error?.error?.msg || 'No se pudo iniciar. Comuniquese con el administrador.';
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: msg,
		});
	}

	// === FORGOT PASSWORD ===
	forgotSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Código enviado',
			detail: 'Revisa tu correo para recuperar la contraseña.',
		});
	}

	// === VERIFY CODE ===
	codeSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Código válido',
			detail: 'Ahora puedes cambiar tu contraseña.',
		});
	}

	codeError(): void {
		this.messageService.add({
			severity: 'error',
			summary: 'Código incorrecto',
			detail: 'El código ingresado no es válido.',
		});
	}

	// === RESET PASSWORD ===
	resetSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Contraseña actualizada',
			detail: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
		});
	}

	resetError(msg: string): void {
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: msg,
		});
	}

	invalidPasswordFormat(): void {
		this.messageService.add({
			severity: 'warn',
			summary: 'Contraseña insegura',
			detail: 'Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.',
		});
	}

	invalidEmail(): void {
		this.messageService.add({
			severity: 'warn',
			summary: 'Correo inválido',
			detail: 'Por favor, ingresa un correo electrónico válido.',
		});
	}

	updateSuccess(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Usuario actualizado',
			detail: 'Los datos se guardaron correctamente.',
		});
	}

	userDeleted(): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Usuario eliminado',
			detail: 'El usuario ha sido eliminado correctamente.',
		});
	}

	showError(msg: string): void {
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: msg,
		});
	}
	showSuccess(msg: string): void {
		this.messageService.add({
			severity: 'success',
			summary: 'Éxito',
			detail: msg,
		});
	}

	msjError(error: ApiError): void {
		const mensaje = error?.error?.message || 'Ocurrió un error inesperado.';
		this.messageService.add({
			severity: 'error',
			summary: 'Error',
			detail: mensaje,
		});
	}
}
