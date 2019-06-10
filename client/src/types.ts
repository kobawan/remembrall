import { MutationFn, MutationResult, OperationVariables } from "react-apollo";

// GRAPHQL TYPES
export interface MutationRenderProps<TData = any, TVariables = OperationVariables> {
  mutation: MutationFn<TData, TVariables>;
  res: MutationResult<TData>;
}

// PROJECT TYPES
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
	color?: string;
}

export interface ToolFields extends CommonFields {
	amount?: number;
	categories?: string[];
}

export interface CategoryFields extends CommonFields {}

export interface ProjectFields extends CommonFields {
	instructions?: string;
	notes?: string;
	categories?: CategoryFields[];
	materials?: MaterialFields[];
	tools?: ToolFields[];
}

export type AllColumnFields = ProjectFields | CategoryFields | MaterialFields | ToolFields;

export type TicketData = CommonFields & {
	[key: string]: any;
};
