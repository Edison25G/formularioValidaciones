import { RolesUsuario } from './roles.types';

export interface JwtPayload {
	sub: string; // ID del usuario (o usa 'id' si ese es el nombre en tu JWT)
	username: string;
	role: RolesUsuario;
	exp: number;
	iat: number;
}
