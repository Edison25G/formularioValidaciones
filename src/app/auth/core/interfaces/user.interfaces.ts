import { RolesUsuario } from '../types';

export interface User {
	id?: number;
	username: string;
	contraseña: string;
	email: string;
	role?: RolesUsuario;
	photo?: string;
	accionesPermitidas?: string[];
	categoriasPermitidas?: string[];
}
