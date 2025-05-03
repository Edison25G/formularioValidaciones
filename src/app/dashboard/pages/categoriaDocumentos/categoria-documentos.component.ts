import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { FilesService } from '../../core/services/files.service';
import { File } from '@auth/core/interfaces/file.interface';
import { environment } from '@envs/environment';
import { MonthService } from '../../core/services/months.service';
import { AuthService } from '@auth/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Month } from '@dashboard/core/interfaces/month.interface';
import { User } from '@auth/core/interfaces/user.interfaces';
import { Anio } from '../../core/interfaces/anio.inertface';

@Component({
	selector: 'app-categoria-documentos',
	standalone: true,
	templateUrl: './categoria-documentos.component.html',
	styleUrls: ['./categoria-documentos.component.css'],
	imports: [
		CommonModule,
		FileUploadModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		FormsModule,
		DialogModule,
		TooltipModule,
		ToastModule,
		ConfirmDialogModule,
		SelectModule,
	],
	providers: [MessageService, ConfirmationService],
})
export class CategoriaDocumentosComponent implements OnInit {
	@ViewChild('fileUpload') fileUpload!: FileUpload;

	nombreCategoria = '';
	permitido = false;
	user: User = {} as User;
	documentos: File[] = [];
	documentosFiltrados: File[] = [];
	private apiUrl = environment.apiUrl + '/api/files';
	mostrarArchivo = false;
	archivoActual: SafeResourceUrl | string | null = null;

	busqueda = '';
	anioSeleccionado: number | null = null;
	mesSeleccionado = '';
	meses: Month[] = [];
	anios: Anio[] = [];
	puedeVer = false;
	puedeDescargar = false;
	puedeImprimir = false;
	constructor(
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer,
		private filesService: FilesService,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private monthService: MonthService,
		private router: Router,
		private authService: AuthService,
		private http: HttpClient,
	) {}

	ngOnInit() {
		this.user = JSON.parse(localStorage.getItem('user') || '{}');
		this.puedeVer = this.user.role === 'admin' || (this.user.accionesPermitidas || []).includes('ver');
		this.puedeDescargar = this.user.role === 'admin' || (this.user.accionesPermitidas || []).includes('descargar');
		this.puedeImprimir = this.user.role === 'admin' || (this.user.accionesPermitidas || []).includes('imprimir');

		const startYear = 2000;
		const endYear = 2100;
		this.anios = [];
		for (let year = startYear; year <= endYear; year++) {
			this.anios.push({ label: `${year}`, value: year });
		}

		this.route.paramMap.subscribe((params) => {
			const nombre = params.get('nombre');
			if (nombre) {
				this.nombreCategoria = decodeURIComponent(nombre);
				if (this.user.role === 'admin' || (this.user.categoriasPermitidas || []).includes(this.nombreCategoria)) {
					this.permitido = true;
					this.cargarDocumentos();
				} else {
					this.router.navigate(['/dashboard/user-home']);
				}
			}
		});
		this.cargarMeses();
	}

	cargarDocumentos() {
		this.filesService.getFiles().subscribe({
			next: (files) => {
				this.documentos = files.filter((file) => file.categoria?.toLowerCase() === this.nombreCategoria.toLowerCase());
				this.filtrarDocumentos();
			},
			error: (err) => {
				console.error('Error al cargar documentos:', err);
			},
		});
	}

	filtrarDocumentos() {
		const busquedaLower = this.busqueda.toLowerCase();
		this.documentosFiltrados = this.documentos.filter((doc) => {
			const coincideBusqueda = doc.name.toLowerCase().includes(busquedaLower);
			const coincideMes = this.mesSeleccionado ? doc.mes?.toLowerCase() === this.mesSeleccionado.toLowerCase() : true;
			const coincideAnio = this.anioSeleccionado ? Number(doc.anio) === this.anioSeleccionado : true;

			return coincideBusqueda && coincideMes && coincideAnio;
		});
	}

	cargarMeses() {
		this.monthService.getMonths().subscribe({
			next: (data: Month[]) => {
				this.meses = data.map((mes) => ({
					...mes,
					label: mes.name,
					value: mes.slug,
				}));
			},
			error: (err) => {
				console.error('Error al cargar meses:', err);
			},
		});
	}

	isMobile(): boolean {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}

	verDocumento(doc: File): void {
		if (!this.puedeVer) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para ver documentos.',
			});
			return;
		}

		const url = `${this.apiUrl}/view/${encodeURIComponent(doc.name)}`;

		this.http.get(url, { responseType: 'blob' }).subscribe({
			next: (blob) => {
				const blobUrl = URL.createObjectURL(blob);

				if (this.isMobile()) {
					const a = document.createElement('a');
					a.href = blobUrl;
					a.download = doc.name;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				} else {
					this.archivoActual = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
					this.mostrarArchivo = true;
				}
			},
			error: (err) => {
				console.error('Error al cargar el archivo:', err);
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo visualizar el archivo.',
				});
			},
		});
	}

	descargarDocumento(doc: File): void {
		if (!this.puedeDescargar) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para descargar documentos.',
			});
			return;
		}

		if (!doc || !doc.name) {
			console.error('No se encontró el nombre del archivo.');
			return;
		}

		const nombreArchivoConExtension = doc.name.replace('.enc', '.pdf');

		const nombreCodificado = encodeURIComponent(nombreArchivoConExtension);

		const url = `${this.apiUrl}/download/${nombreCodificado}`;

		this.http.get(url, { responseType: 'blob' }).subscribe({
			next: (blob: Blob) => {
				const blobUrl = URL.createObjectURL(blob);

				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = nombreArchivoConExtension;

				link.click();

				URL.revokeObjectURL(blobUrl);
			},
			error: (err) => {
				console.error('Error al descargar el archivo:', err);
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo descargar el archivo.',
				});
			},
		});
	}

	imprimirDocumento(doc: File) {
		if (!this.puedeImprimir) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para imprimir documentos.',
			});
			return;
		}

		const token = this.authService.getToken();

		if (token) {
			const url = `${this.apiUrl}/print/${doc.name}`;

			const headers = { Authorization: `Bearer ${token}` };

			this.http.get(url, { headers, responseType: 'blob' }).subscribe({
				next: (blob) => {
					const blobUrl = URL.createObjectURL(blob);
					const ventana = window.open(blobUrl, '_blank');
					ventana?.addEventListener('load', () => ventana.print());
				},
				error: (err) => {
					console.error('Error al imprimir:', err);
					this.messageService.add({
						severity: 'error',
						summary: 'Error',
						detail: 'No se pudo imprimir el archivo.',
					});
				},
			});
		} else {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'No se ha encontrado un token válido para realizar la operación.',
			});
		}
	}

	cerrarVista() {
		this.mostrarArchivo = false;
		this.archivoActual = null;
	}

	limpiarFiltros() {
		this.busqueda = '';
		this.mesSeleccionado = '';
		this.anioSeleccionado = null;
		this.filtrarDocumentos();
	}

	obtenerIcono(doc: File): string {
		const extension = doc.name.split('.').pop()?.toLowerCase();
		switch (extension) {
			case 'pdf':
				return 'pi pi-file-pdf text-red-500';
			case 'doc':
			case 'docx':
				return 'pi pi-file-word text-blue-500';
			case 'jpg':
			case 'jpeg':
			case 'png':
				return 'pi pi-image text-green-500';
			case 'zip':
				return 'pi pi-file-zip text-yellow-500';
			default:
				return 'pi pi-file text-gray-500';
		}
	}
}
