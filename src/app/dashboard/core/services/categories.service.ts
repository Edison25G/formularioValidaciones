import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { Categoria } from '../interfaces/categories.interface';

@Injectable({
	providedIn: 'root',
})
export class CategoryService {
	private readonly apiBaseUrl = `${environment.apiUrl}/api/categories`;

	constructor(private http: HttpClient) {}

	getCategories(): Observable<Categoria[]> {
		return this.http.get<Categoria[]>(this.apiBaseUrl);
	}

	crearCategoria(categoria: Categoria): Observable<Categoria> {
		return this.http.post<Categoria>(this.apiBaseUrl, categoria);
	}

	actualizarCategoria(categoria: Categoria): Observable<Categoria> {
		return this.http.put<Categoria>(`${this.apiBaseUrl}/${categoria.id}`, categoria);
	}

	eliminarCategoria(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiBaseUrl}/${id}`);
	}
}
