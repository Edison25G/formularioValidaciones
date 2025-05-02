import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		PanelMenuModule,
		ToastModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		AvatarModule,
		FloatLabelModule,
		FormsModule,
		CommonModule,
	],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent {
	menuItems = [
		{
			label: 'Tablero',
			icon: 'pi pi-home',
			routerLink: '/dashboard',
		},
		{
			label: 'Carpetas',
			icon: 'pi pi-folder',
			routerLink: '/files',
		},
		{
			label: 'Usuarios',
			icon: 'pi pi-users',
			routerLink: '/users',
		},
		{
			label: 'Cerrar Sesión',
			icon: 'pi pi-sign-out',
			routerLink: '/auth/logout',
		},
	];

	files = [
		{ name: 'Documento1.pdf', size: '1.2 MB', uploadDate: '2025-03-26' },
		{ name: 'Imagen2.png', size: '500 KB', uploadDate: '2025-03-25' },
		{ name: 'Presentación3.pptx', size: '2.5 MB', uploadDate: '2025-03-24' },
	];

	// filteredFiles = [...this.files];
	// newFolderName: string = '';
	// searchQuery: string = '';

	// createFolder() {
	// 	if (this.newFolderName.trim()) {
	// 		console.log('Crear carpeta:', this.newFolderName);
	// 		this.newFolderName = '';
	// 	}
	// }

	// searchFiles() {
	// 	this.filteredFiles = this.files.filter((file) => file.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
	// }

	// viewFile(file: any) {
	// 	console.log('Ver archivo:', file);
	// 	// Aquí puedes implementar la lógica para ver el archivo
	// }

	// deleteFile(file: any) {
	// 	console.log('Eliminar archivo:', file);
	// 	this.files = this.files.filter((f) => f !== file);
	// 	this.filteredFiles = [...this.files];
	// }

	// printFile(file: any) {
	// 	console.log('Imprimir archivo:', file);
	// 	// Aquí puedes implementar la lógica para imprimir el archivo
	// }
}
