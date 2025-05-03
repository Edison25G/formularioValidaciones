import { Component, OnInit } from '@angular/core';

import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '@auth/core/interfaces/user.interfaces';
@Component({
	selector: 'app-inicio-second',
	standalone: true,
	imports: [CommonModule, ChartModule],
	templateUrl: './inicio-second.component.html',
	styleUrls: ['./inicio-second.component.css'],
})
export class InicioSecondComponent implements OnInit {
	user: User | null = null;
	constructor(private router: Router) {}
	ngOnInit(): void {
		const storedUser = localStorage.getItem('user');
		if (storedUser) {
			this.user = JSON.parse(storedUser);
			console.log('Usuario cargado:', this.user);
		}
	}

	logout() {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.router.navigate(['/login']);
	}
}
