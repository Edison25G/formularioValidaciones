import { Mes } from '../types';

export interface File {
	id: number;
	name: string;
	description: string;
	categoria: string;
	mes: Mes;
	anio: number;
	size: number;
}
