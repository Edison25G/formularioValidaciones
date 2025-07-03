import { Validators } from '@angular/forms';

export class FormValidators {
	static soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
	static cedula_ruc = /^(\d{10}|\d{13})$/;
	static telefono = /^\d{10}$/;
	static direccionSegura = /^[^<>$%&]*$/;
	static sitio_web = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,6}(\/)?$/i;
	static contrasenaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;

	static nombreValidator = [
		Validators.required,
		Validators.minLength(3),
		Validators.maxLength(30),
		Validators.pattern(FormValidators.soloLetras),
	];

	static cedulaValidator = [Validators.required, Validators.pattern(FormValidators.cedula_ruc)];

	static telefonoValidator = [Validators.required, Validators.pattern(FormValidators.telefono)];

	static direccionValidator = [
		Validators.required,
		Validators.maxLength(200),
		Validators.pattern(FormValidators.direccionSegura),
	];

	static salarioValidator = [Validators.required, Validators.min(470), Validators.max(5000)];

	static emailValidator = [Validators.required, Validators.email];

	static sitioWebValidator = [Validators.required, Validators.pattern(FormValidators.sitio_web)];

	static contrasenaValidator = [
		Validators.required,
		Validators.minLength(8),
		Validators.maxLength(12),
		Validators.pattern(FormValidators.contrasenaSegura),
	];
}
