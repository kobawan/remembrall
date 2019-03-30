export enum ColumnType {
    Projects = "Projects",
    Categories = "Categories",
    Tools = "Tools",
    Materials = "Materials",
}

export interface CommonFields {
    id: string;
    name: string;
}

export interface MaterialFields extends CommonFields {
	amount?: number;
}

export interface ToolFields extends CommonFields {
    amount?: number;
    categories?: string[];
}

export interface CategoryFields extends CommonFields {
	tools?: ToolFields[];
}

export interface ProjectFields extends CommonFields {
	instructions?: string;
	notes?: string;
	categories?: CategoryFields[];
    materials?: MaterialFields[];
    tools?: ToolFields[];
}

export type AllColumnFields = ProjectFields | CategoryFields | MaterialFields | ToolFields;
