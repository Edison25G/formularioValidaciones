import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'amc-root',
	standalone: true,
	imports: [RouterOutlet, ButtonModule, ToastModule],
	providers: [],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'formulario-validaciones';

	// Constructor vacío porque ya no se inyectan servicios eliminados
	constructor() {}
}
