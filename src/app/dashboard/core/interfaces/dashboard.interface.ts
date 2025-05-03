// src/app/dashboard/core/interfaces/dashboard.interface.ts
import { User } from '../../../auth/core/interfaces/user.interfaces';
import { Categoria } from '@dashboard/core/interfaces/categories.interface';
import { File } from '@dashboard/core/interfaces/file.interface';

export interface DashboardData {
	usuarios: User[]; // Lista de usuarios
	categorias: Categoria[]; // Lista de categorías
	archivos: File[]; // Lista de archivos
}
