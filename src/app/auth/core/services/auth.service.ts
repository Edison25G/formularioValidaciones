import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../interfaces/user.interfaces';
import { RolesUsuario, JwtPayload, UserSession, ApiResponse } from '../types';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private tokenKey = 'token';
	private userKey = 'user';
	private myAppUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	saveToken(token: string): void {
		localStorage.setItem(this.tokenKey, token);
	}

	saveUserSession(user: UserSession): void {
		localStorage.setItem(this.userKey, JSON.stringify(user));
	}

	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	getUserFromToken(): JwtPayload | null {
		const token = this.getToken();
		if (!token) return null;
		try {
			return jwtDecode<JwtPayload>(token);
		} catch {
			return null;
		}
	}

	isTokenExpired(): boolean {
		const token = this.getToken();
		if (!token) return true;

		try {
			const decoded: JwtPayload = jwtDecode(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return decoded.exp < currentTime;
		} catch {
			return true;
		}
	}

	isAuthenticated(): boolean {
		return !!this.getToken() && !this.isTokenExpired();
	}

	getUsername(): string {
		const user = localStorage.getItem(this.userKey);
		try {
			const parsed: UserSession = JSON.parse(user || '');
			return parsed.username;
		} catch {
			return 'Usuario';
		}
	}

	getRole(): RolesUsuario {
		const user = localStorage.getItem(this.userKey);
		try {
			const parsed: UserSession = JSON.parse(user || '');
			return parsed.role;
		} catch {
			return 'user';
		}
	}

	getCategorias(): string[] {
		const user = localStorage.getItem(this.userKey);
		try {
			const parsed: UserSession = JSON.parse(user || '');
			return parsed.categoriasPermitidas || [];
		} catch {
			return [];
		}
	}

	getAcciones(): string[] {
		const user = localStorage.getItem(this.userKey);
		try {
			const parsed: UserSession = JSON.parse(user || '');
			return parsed.accionesPermitidas || [];
		} catch {
			return [];
		}
	}

	logout(): void {
		localStorage.removeItem(this.tokenKey);
		localStorage.removeItem(this.userKey);
	}

	getProfile(): Observable<User> {
		return this.http.get<User>(`${this.myAppUrl}/api/users/me`);
	}

	sendResetCode(email: string): Observable<ApiResponse> {
		return this.http.post<ApiResponse>(`${this.myAppUrl}/api/auth/send-reset-code`, { email });
	}

	verifyResetCode(email: string, code: string): Observable<ApiResponse> {
		return this.http.post<ApiResponse>(`${this.myAppUrl}/api/auth/verify-reset-code`, { email, code });
	}

	resetPassword(email: string, code: string, newPassword: string): Observable<ApiResponse> {
		return this.http.post<ApiResponse>(`${this.myAppUrl}/api/auth/reset-password`, {
			email,
			code,
			newPassword,
		});
	}

	refreshUserFromBackend(): void {
		this.getProfile().subscribe({
			next: (user) => {
				this.saveUserSession({
					username: user.username,
					role: user.role ?? 'user',
					accionesPermitidas: user.accionesPermitidas || [],
					categoriasPermitidas: user.categoriasPermitidas || [],
				});
			},
			error: (err) => {
				console.error('Error al actualizar sesión:', err);
			},
		});
	}

	renewToken(refreshToken: string): Observable<{ accessToken: string }> {
		return this.http.post<{ accessToken: string }>(`${this.myAppUrl}/api/auth/refresh`, { refreshToken });
	}
}
