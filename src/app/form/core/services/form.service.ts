import { environment } from '../../../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class FormService {
	private apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	enviarFormulario(data: any) {
		return this.http.post(`${this.apiUrl}/form`, data);
	}
}
