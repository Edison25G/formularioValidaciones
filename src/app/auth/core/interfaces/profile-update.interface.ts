export interface ProfileUpdatePayload {
	username: string;
	email: string;
	contraseña?: string; // Solo si se proporciona una nueva contraseña
	photo?: string;
}
