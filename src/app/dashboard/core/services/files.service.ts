import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { File } from '@auth/core/interfaces/file.interface';
import { User } from '@auth/core/interfaces/user.interfaces'; // Asumiendo que tienes una interfaz User

@Injectable({
	providedIn: 'root',
})
export class FilesService {
	private readonly filesApiUrl = `${environment.apiUrl}/api/files`;
	private readonly usersApiUrl = `${environment.apiUrl}/api/users`;

	constructor(private http: HttpClient) {}

	// 🔹 Obtener archivos (opcionalmente filtrado por usuario)
	getFiles(usuarioId?: string): Observable<File[]> {
		let params = new HttpParams();
		if (usuarioId) {
			params = params.set('usuario_id', usuarioId);
		}
		return this.http.get<File[]>(this.filesApiUrl, { params });
	}

	// 🔹 Obtener usuarios (solo para admin)
	getUsuarios(): Observable<User[]> {
		// Cambié el tipo de retorno a User[]
		return this.http.get<User[]>(this.usersApiUrl);
	}

	// 🔹 Eliminar archivo
	deleteFile(id: number): Observable<void> {
		return this.http.delete<void>(`${this.filesApiUrl}/${id}`);
	}
}
