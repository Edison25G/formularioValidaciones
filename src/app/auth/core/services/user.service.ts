import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interfaces';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { ApiResponse } from '../types'; // ✅ asegura que esté exportado

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private readonly apiBaseUrl = `${environment.apiUrl}/api/users`;

	constructor(private http: HttpClient) {}

	register(user: User): Observable<ApiResponse> {
		return this.http.post<ApiResponse>(`${this.apiBaseUrl}/register`, user);
	}

	login(user: User): Observable<{ token: string; refreshToken: string }> {
		return this.http.post<{ token: string; refreshToken: string }>(`${this.apiBaseUrl}/login`, user);
	}

	getAll(): Observable<User[]> {
		return this.http.get<User[]>(`${this.apiBaseUrl}`);
	}

	update(id: number, user: Partial<User>): Observable<ApiResponse> {
		return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${id}`, user);
	}

	delete(id: number): Observable<ApiResponse> {
		return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${id}`);
	}

	updateProfile(id: number, data: Partial<User>): Observable<ApiResponse> {
		return this.http.put<ApiResponse>(`${this.apiBaseUrl}/profile/${id}`, data);
	}

	getProfile(): Observable<User> {
		return this.http.get<User>(`${this.apiBaseUrl}/me`);
	}
}
