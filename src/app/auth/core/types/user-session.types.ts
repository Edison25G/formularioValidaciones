import { RolesUsuario } from './roles.types';

export interface UserSession {
	username: string;
	role: RolesUsuario;
	accionesPermitidas: string[];
	categoriasPermitidas: string[];
}
