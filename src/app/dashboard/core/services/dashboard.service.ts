import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@envs/environment';
import { DashboardData } from '../interfaces/dashboard.interface';

@Injectable({ providedIn: 'root' })
export class DashboardService {
	private myAppUrl: string;
	private myApiUrl: string;

	constructor(private http: HttpClient) {
		this.myAppUrl = environment.apiUrl;
		this.myApiUrl = 'api/dashboard';
	}

	getDashboardData(): Observable<DashboardData> {
		return this.http.get<DashboardData>(`${this.myAppUrl}/${this.myApiUrl}`);
	}
}
