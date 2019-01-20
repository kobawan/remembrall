export enum ColumnType {
    Projects = "Projects",
    Categories = "Categories",
    Tools = "Tools",
    Materials = "Materials",
}

export interface MaterialFields {
    name: string;
	amount?: number;
}

export interface ToolFields {
    name: string;
    amount?: number;
    categories?: string[];
}

export interface CategoryFields {
    name: string;
	tools?: ToolFields[];
}

export interface ProjectFields {
    name: string;
	instructions?: string;
	notes?: string;
	categories?: CategoryFields[];
	materials?: MaterialFields[];
}
