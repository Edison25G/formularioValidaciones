import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from '../../../../../enviroments/environment.prod';
import { environment } from '../../../../../enviroments/environment';
import { User } from '../interfaces/user.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.apiUrl;
    this.myApiUrl = 'api/users/';
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}/${this.myApiUrl}register`, user);
  }

  login(user: User): Observable<any> {
    return this.http.post(`${this.myAppUrl}/${this.myApiUrl}login`, user);
  }
}
