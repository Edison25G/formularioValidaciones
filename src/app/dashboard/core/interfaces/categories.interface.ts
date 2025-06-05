export interface Categoria {
	id: number;
	name: string;
	slug: string;
	icon: string;
	parent_id?: number | null;
	subcategories?: Categoria[];
}
