import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@envs/environment';
import { Observable } from 'rxjs';
import { Month } from '@dashboard/core/interfaces/month.interface'; // Importar la interfaz correcta

@Injectable({
	providedIn: 'root',
})
export class MonthService {
	private myAppUrl = environment.apiUrl;
	private myApiUrl = 'api/months/';

	constructor(private http: HttpClient) {}

	// Obtener todos los meses
	getMonths(): Observable<Month[]> {
		// Usamos el tipo de retorno Month[]
		return this.http.get<Month[]>(`${this.myAppUrl}/${this.myApiUrl}`);
	}
}
