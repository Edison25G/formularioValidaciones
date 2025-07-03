import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormValidators } from '../../../utils/form.validators';
import { FormService } from '../../core/services/form.service';

@Component({
	selector: 'app-formulario-personal',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		InputTextModule,
		CalendarModule,
		DropdownModule,
		PasswordModule,
		ButtonModule,
		ToastModule,
	],
	providers: [MessageService],
	templateUrl: './formulario-personal.component.html',
	styleUrls: ['./formulario-personal.component.css'],
})
export class FormularioPersonalComponent implements OnInit {
	formulario!: FormGroup;
	generos = ['Masculino', 'Femenino', 'Otro'];
	fechaMinima = new Date(1900, 0, 1);
	fechaMaxima = new Date();

	constructor(
		private fb: FormBuilder,
		private messageService: MessageService,
		private formService: FormService,
	) {}

	ngOnInit(): void {
		this.formulario = this.fb.group({
			nombre: ['', FormValidators.nombreValidator],
			apellido: ['', FormValidators.nombreValidator],
			cedula_ruc: ['', FormValidators.cedulaValidator],
			telefono: ['', FormValidators.telefonoValidator],
			fecha_nacimiento: ['', Validators.required],
			genero: ['', Validators.required],
			direccion: ['', FormValidators.direccionValidator],
			salario: ['', FormValidators.salarioValidator],
			email: ['', FormValidators.emailValidator],
			sitio_web: ['', FormValidators.sitioWebValidator],
			contrasena: ['', FormValidators.contrasenaValidator],
		});
	}

	enviar() {
		this.formulario.markAllAsTouched();

		const controls = this.formulario.controls;

		const todosVacios = Object.values(controls).every((control) => !control.value || control.value === '');

		if (todosVacios) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Campos obligatorios',
				detail: 'Debe llenar todos los campos requeridos.',
			});
			return;
		}

		if (controls['nombre'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Nombre inválido',
				detail: 'Debe tener entre 3 y 30 letras, sin números ni símbolos.',
			});
			return;
		}

		if (controls['apellido'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Apellido inválido',
				detail: 'Debe tener entre 3 y 30 letras, sin números ni símbolos.',
			});
			return;
		}

		if (controls['cedula_ruc'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Cédula/RUC inválida',
				detail: 'Debe contener solo números y tener 10 o 13 dígitos.',
			});
			return;
		}

		if (controls['telefono'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Teléfono inválido',
				detail: 'Debe contener exactamente 10 dígitos numéricos.',
			});
			return;
		}

		if (controls['fecha_nacimiento'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Fecha de nacimiento inválida',
				detail: 'Debe estar entre 01/01/1900 y la fecha actual.',
			});
			return;
		}

		if (controls['genero'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Género requerido',
				detail: 'Debe seleccionar un género.',
			});
			return;
		}

		if (controls['direccion'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Dirección inválida',
				detail: 'No debe contener caracteres peligrosos y máximo 200 caracteres.',
			});
			return;
		}

		if (controls['salario'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Salario inválido',
				detail: 'Debe estar entre $470 y $5000.',
			});
			return;
		}

		if (controls['email'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Email inválido',
				detail: 'Debe ingresar un correo electrónico válido.',
			});
			return;
		}

		if (controls['sitio_web'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Sitio web inválido',
				detail: 'Debe ingresar una URL válida (http o https).',
			});
			return;
		}

		if (controls['contrasena'].invalid) {
			this.messageService.add({
				severity: 'error',
				summary: 'Contraseña inválida',
				detail: 'Debe tener entre 8 y 12 caracteres, incluyendo mayúscula, minúscula, número y símbolo.',
			});
			return;
		}

		const formData = {
			...this.formulario.value,
			fecha_nacimiento: this.formulario.value.fecha_nacimiento.toISOString().split('T')[0],
		};

		this.formService.enviarFormulario(formData).subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Formulario enviado',
					detail: 'Los datos fueron guardados correctamente.',
				});
				this.formulario.reset();
			},
			error: (error) => {
				console.error('Error al enviar al backend:', error);
				this.messageService.add({
					severity: 'error',
					summary: 'Error al enviar',
					detail: 'Ocurrió un error al guardar los datos.',
				});
			},
		});
	}

	limpiar() {
		this.formulario.reset();
		this.messageService.add({
			severity: 'info',
			summary: 'Formulario limpiado',
			detail: 'Todos los campos han sido reiniciados.',
		});
	}
}
