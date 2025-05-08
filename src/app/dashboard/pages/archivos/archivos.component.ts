import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Toast } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule, FileUpload } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { MESES } from '@dashboard/core/constants/meses.const';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FilesService } from '../../core/services/files.service';
import { File } from '@auth/core/interfaces/file.interface';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { CategoryService } from '../../core/services/categories.service';
import { AuthService } from '@auth/core/services/auth.service';
import { environment } from '@envs/environment';
import { User } from '@auth/core/interfaces/user.interfaces';
import { DropdownOption } from '@auth/core/interfaces/dropdown-option.interface';
import { Categoria } from '@dashboard/core/interfaces/categories.interface';

@Component({
	selector: 'app-archivos',
	standalone: true,
	templateUrl: './archivos.component.html',
	styleUrls: ['./archivos.component.css'],
	imports: [
		CommonModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		DialogModule,
		FormsModule,
		ToastModule,
		Toast,
		DropdownModule,
		FileUploadModule,
		ConfirmDialogModule,
		ProgressBarModule,
		SelectModule,
		DatePicker,
	],
	providers: [MessageService, ConfirmationService],
})
export class ArchivosComponent implements OnInit {
	@ViewChild('fileUpload') fileUpload!: FileUpload;
	private apiUrl = environment.apiUrl + '/api/files';

	archivoActualURL!: SafeResourceUrl;
	archivos: File[] = [];
	usuarios: DropdownOption[] = [];
	selectedUsuarioId = 'todos';
	isAdmin = false;
	mostrarPDF = false;
	progresoSubida = 0;
	subiendoArchivo = false;
	acciones: string[] = [];
	anioSeleccionado: Date | null = null;

	mostrarModalEditar = false;
	archivoEditar: any = {};
	categorias: Categoria[] = [];
	meses: { label: string; value: string }[] = MESES;

	opcionesCategorias: DropdownOption[] = [];
	categoriaSeleccionada: string | null = null;
	mesSeleccionado: string | null = null;
	descripcionArchivo = '';
	anioSeleccionadoEditar: Date | null = null;

	role = '';
	username = '';
	puedeSubir = false;
	puedeEditar = false;
	puedeEliminar = false;
	puedeVer = false;
	puedeDescargar = false;
	constructor(
		private filesService: FilesService,
		private sanitizer: DomSanitizer,
		private messageService: MessageService,
		private confirmationService: ConfirmationService,
		private http: HttpClient,
		private categoryService: CategoryService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		setTimeout(() => {
			const user = JSON.parse(localStorage.getItem('user') || '{}');
			this.role = user.role || 'user';
			this.username = user.username || 'Desconocido';
			this.acciones = this.authService.getAcciones();

			this.puedeVer = this.acciones.includes('ver') || this.role === 'admin';
			this.puedeDescargar = this.acciones.includes('descargar') || this.role === 'admin';
			this.puedeSubir = this.acciones.includes('subir') || this.role === 'admin';
			this.puedeEditar = this.acciones.includes('editar') || this.role === 'admin';
			this.puedeEliminar = this.acciones.includes('eliminar') || this.role === 'admin';
			this.authService.refreshUserFromBackend();
			if (this.role === 'admin') {
				this.obtenerUsuarios();
			} else {
				this.cargarArchivos();
			}
			this.cargarCategorias();
		}, 200);
	}

	cargarCategorias(): void {
		this.categoryService.getCategories().subscribe({
			next: (data: Categoria[]) => {
				this.categorias = data;
				this.opcionesCategorias = data.map((cat: Categoria) => ({
					label: cat.name,
					value: cat.slug,
				}));
			},
			error: (err) => {
				console.error('Error al cargar categorías:', err);
			},
		});
	}

	obtenerUsuarios(): void {
		this.filesService.getUsuarios().subscribe({
			next: (data) => {
				const lista = data.map((user: User) => ({
					// Aquí usamos 'User'
					label: `${user.username}`,
					value: user.id?.toString() || 'unknown', // Convertimos a string
				}));

				this.usuarios = [
					{ label: '👤 Seleccione un usuario', value: 'seleccione' },
					{ label: 'Todos', value: 'todos' },
					...lista,
				];
				this.selectedUsuarioId = 'seleccione'; // Valor por defecto
			},
			error: (err) => {
				console.error('Error al obtener usuarios:', err);
			},
		});
	}

	cargarArchivos(): void {
		// Si es admin y no ha seleccionado nada (null o 'seleccione'), no cargar archivos
		if (this.role === 'admin' && (!this.selectedUsuarioId || this.selectedUsuarioId === 'seleccione')) {
			this.archivos = [];
			return;
		}

		const filtroUsuario: string | undefined =
			this.role === 'admin' && this.selectedUsuarioId !== 'todos' ? this.selectedUsuarioId : undefined;

		this.filesService.getFiles(filtroUsuario).subscribe({
			next: (data) => {
				this.archivos = data;
			},
			error: (err) => {
				console.error('Error al cargar archivos:', err);
			},
		});
	}

	onFiltroUsuarioChange(): void {
		this.cargarArchivos();
	}

	subirArchivo(event: any): void {
		if (!this.puedeSubir) {
			this.messageService.add({
				severity: 'error',
				summary: 'Permiso denegado',
				detail: 'No tienes permiso para subir archivos.',
			});
			return;
		}

		const archivoSeleccionado = event.files[0];
		if (!archivoSeleccionado) {
			this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un archivo.' });
			return;
		}

		if (!this.categoriaSeleccionada || !this.mesSeleccionado) {
			this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar Categoría y Mes.' });
			return;
		}

		const tiposPermitidos = [
			'application/pdf',
			'image/jpeg',
			'image/png',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/zip',
		];

		const extensionesPermitidas = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.zip'];

		const nombreArchivo = archivoSeleccionado.name.toLowerCase();
		const extensionArchivo = nombreArchivo.slice(nombreArchivo.lastIndexOf('.'));

		const tipoValido = tiposPermitidos.includes(archivoSeleccionado.type);
		const extensionValida = extensionesPermitidas.includes(extensionArchivo);

		if (!tipoValido && !extensionValida) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: `Tipo de archivo no válido. Tipos permitidos: ${extensionesPermitidas.join(', ')}`,
			});
			return;
		}

		const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
		if (archivoSeleccionado.size > maxSizeInBytes) {
			this.messageService.add({
				severity: 'error',
				summary: 'Error',
				detail: 'El archivo supera el tamaño máximo permitido (10MB).',
			});
			return;
		}

		const formData = new FormData();
		formData.append('file', archivoSeleccionado);
		formData.append('description', this.descripcionArchivo || '');
		formData.append('folder', this.categoriaSeleccionada);
		formData.append('month', this.mesSeleccionado);
		const anio = this.anioSeleccionado?.getFullYear().toString() || '';
		formData.append('anio', anio);

		const token = localStorage.getItem('token');

		this.http
			.post(`${this.apiUrl}/upload`, formData, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.subscribe({
				next: (_res) => {
					this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Archivo subido correctamente.' });
					this.fileUpload.clear();
					this.categoriaSeleccionada = null;
					this.mesSeleccionado = null;
					this.descripcionArchivo = '';
					this.cargarArchivos();
				},
				error: (err) => {
					console.error(err);
					this.messageService.add({
						severity: 'error',
						summary: 'Error',
						detail: err.error?.message || 'Error al subir archivo.',
					});
				},
			});
	}
	// Función para detectar dispositivos móviles
	isMobile(): boolean {
		return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	}
	verArchivo(archivo: File): void {
		if (!this.puedeVer) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para ver archivos.',
			});
			return;
		}

		const url = `${this.apiUrl}/view/${archivo.name}`;

		// Realizar la solicitud GET con el token ya incluido automáticamente por el interceptor
		this.http.get(url, { responseType: 'blob' }).subscribe({
			next: (blob) => {
				const fileURL = URL.createObjectURL(blob);

				if (this.isMobile()) {
					// En dispositivos móviles forzar la descarga
					const a = document.createElement('a');
					a.href = fileURL;
					a.download = archivo.name; // Nombre del archivo cuando se descargue
					document.body.appendChild(a);
					a.click(); // Simula el clic para iniciar la descarga
					document.body.removeChild(a); // Elimina el enlace del DOM
				} else {
					// En PC o tablet mostrar el archivo en un iframe
					this.archivoActualURL = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
					this.mostrarPDF = true; // Mostrar el modal con la vista previa
				}
			},
			error: (err) => {
				console.error(err);
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo visualizar el archivo.',
				});
			},
		});
	}

	descargarArchivo(archivo: File): void {
		// Verifica si tiene permisos para descargar
		if (!this.puedeDescargar) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para descargar archivos.',
			});
			return;
		}

		// Verifica si el archivo tiene un nombre
		if (!archivo || !archivo.name) {
			console.error('No se encontró el nombre del archivo.');
			return;
		}

		// Codificar el nombre del archivo para manejar espacios y caracteres especiales
		const nombreCodificado = encodeURIComponent(archivo.name);

		// Construir la URL con el nombre del archivo codificado
		const url = `${this.apiUrl}/download/${nombreCodificado}`;

		// Realizar la solicitud GET con el token ya incluido automáticamente por el interceptor
		this.http.get(url, { responseType: 'blob' }).subscribe({
			next: (blob) => {
				// Crear un objeto URL a partir del blob
				const blobUrl = URL.createObjectURL(blob);

				// Crear un enlace y forzar la descarga
				const link = document.createElement('a');
				link.href = blobUrl;
				link.download = archivo.name; // Nombre con el que se descargará el archivo

				// Simula un clic en el enlace para iniciar la descarga
				link.click();

				// Liberar el objeto URL
				URL.revokeObjectURL(blobUrl);
			},
			error: (err) => {
				console.error(err);
				this.messageService.add({
					severity: 'error',
					summary: 'Error',
					detail: 'No se pudo descargar el archivo.',
				});
			},
		});
	}

	eliminarArchivo(file: File): void {
		if (!this.puedeEliminar) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para eliminar archivos.',
			});
			return;
		}
		this.confirmationService.confirm({
			message: '¿Deseas eliminar este archivo?',
			header: 'Confirmar',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.filesService.deleteFile(file.id).subscribe({
					next: () => {
						this.messageService.add({
							severity: 'success',
							summary: 'Eliminado',
							detail: 'Archivo eliminado correctamente.',
						});
						this.cargarArchivos();
					},
					error: (err) => {
						console.error(err);
						this.messageService.add({
							severity: 'error',
							summary: 'Error',
							detail: 'Error al eliminar archivo.',
						});
					},
				});
			},
		});
	}

	cerrarModal() {
		this.mostrarPDF = false;
		this.archivoActualURL = '';
	}

	abrirModalEditar(archivo: File) {
		this.archivoEditar = { ...archivo };
		// Asegúrate de que archivoEditar.anio sea un valor Date
		if (this.archivoEditar.anio) {
			this.archivoEditar.anio = new Date(this.archivoEditar.anio, 0, 1); // Convertirlo a Date si es necesario
		}

		this.mostrarModalEditar = true;
	}

	cerrarModalEditar() {
		this.mostrarModalEditar = false;
		this.archivoEditar = {};
	}

	guardarEdicion() {
		if (!this.puedeEditar) {
			this.messageService.add({
				severity: 'warn',
				summary: 'Acceso restringido',
				detail: 'No tienes permiso para editar archivos.',
			});
			return;
		}

		const token = localStorage.getItem('token');
		const anio = this.anioSeleccionadoEditar ? new Date(this.anioSeleccionadoEditar.getFullYear(), 0, 1) : null;

		this.http
			.put(
				`${this.apiUrl}/${this.archivoEditar.id}`,
				{
					categoria: this.archivoEditar.categoria,
					mes: this.archivoEditar.mes,
					description: this.archivoEditar.description,
					anio: anio ? anio.getFullYear().toString() : '',
					user: this.username,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.subscribe({
				next: () => {
					this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Archivo editado correctamente.' });
					this.mostrarModalEditar = false;
					this.cargarArchivos();
				},
				error: (err) => {
					console.error(err);
					this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al editar archivo.' });
				},
			});
	}

	actualizarProgreso(event: any) {
		this.subiendoArchivo = true;
		const total = event.total || event.originalEvent?.total;
		const loaded = event.loaded || event.originalEvent?.loaded;

		if (total && loaded) {
			this.progresoSubida = Math.round((loaded / total) * 100);
		}

		if (this.progresoSubida === 100) {
			setTimeout(() => {
				this.subiendoArchivo = false;
				this.progresoSubida = 0;
			}, 500);
		}
	}
}
