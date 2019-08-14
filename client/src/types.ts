import { MutationFn, MutationResult, OperationVariables } from "react-apollo";

// GRAPHQL TYPES
export interface MutationRenderProps<TData = any, TVariables = OperationVariables> {
  mutation: MutationFn<TData, TVariables>;
  res: MutationResult<TData>;
}

// APP TYPES
export enum ColumnType {
	Projects = "Projects",
	Categories = "Categories",
	Tools = "Tools",
	Materials = "Materials",
}

export enum OverlayZIndex {
	Popup = 98,
	Form = 96,
	Tooltip = 94,
}
export interface TypenameField {
	__typename?: string;
}

export interface CommonFields extends TypenameField {
	id: string;
	name: string;
}

export interface MaterialFields extends CommonFields {
	amount: number;
	color: string | null;
}

export interface ToolFields extends CommonFields {
	amount: number;
	type: string | null;
	size: string | null;
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

/**
 * @todo improve typing
 */
export type TicketData = CommonFields & { [key: string]: any };
