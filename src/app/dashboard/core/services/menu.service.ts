import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MenuService {
	private actualizarMenu$ = new BehaviorSubject<boolean>(false);

	get menuTrigger$() {
		return this.actualizarMenu$.asObservable();
	}

	dispararRecarga() {
		this.actualizarMenu$.next(true);
	}
}
