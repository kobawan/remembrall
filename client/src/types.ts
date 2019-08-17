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

interface TypenameField {
  __typename: string;
}

export interface InProjectField {
  // @todo fix optional field
  inProjects?: CommonFields[];
}

export interface AmountField {
  amount: number;
}

export interface CommonFields {
  id: string;
  name: string;
}

export type CommonFieldsWithTypename = CommonFields & TypenameField;

export interface MaterialFields extends CommonFields, InProjectField, AmountField {
  color: string | null;
}

export interface ToolFields extends CommonFields, InProjectField, AmountField {
  type: string | null;
  size: string | null;
}

export type CategoryFields = CommonFields & InProjectField;

export interface ProjectFields extends CommonFields {
  instructions?: string;
  notes?: string;
  categories?: CategoryFields[];
  materials?: MaterialFields[];
  tools?: ToolFields[];
}

export type AllColumnFields = ProjectFields | CategoryFields | MaterialFields | ToolFields;

// @todo fix type
export type TempAnyObject = { [key: string]: any };
