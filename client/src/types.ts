export enum ColumnType {
    Projects = "Projects",
    Categories = "Categories",
    Tools = "Tools",
    Materials = "Materials",
}

export interface UserFields {
    id: string;
    projects: ProjectFields[];
    categories: CategoryFields[];
    tools: ToolFields[];
    materials: MaterialFields[];
}

export interface MaterialFields {
    id: string;
    name: string;
	amount?: number;
}

export interface ToolFields {
    id: string;
    name: string;
    amount?: number;
    categories?: string[];
}

export interface CategoryFields {
    id: string;
    name: string;
	tools?: ToolFields[];
}

export interface ProjectFields {
    id: string;
    name: string;
	instructions?: string;
	notes?: string;
	categories?: CategoryFields[];
    materials?: MaterialFields[];
    tools?: ToolFields[];
}

export type AllColumnFields = ProjectFields | CategoryFields | MaterialFields | ToolFields;
