export enum ColumnType {
  Projects = "Projects",
  Categories = "Categories",
  Tools = "Tools",
  Materials = "Materials",
}

export enum OverlayZIndex {
  Popup = 98,
  Form = 92,
  Tooltip = 94,
}

export interface TypenameField {
  __typename: string;
}

export interface InProjectField {
  inProjects: ProjectFields[];
}

export interface AvailableAmountField {
  availableAmount: number;
}

export interface AmountField {
  amount: number;
}

export interface CommonFields {
  id: string;
  name: string;
}

export interface MaterialFields extends CommonFields, InProjectField, AmountField, AvailableAmountField {
  color: string | null;
}
export type MaterialFieldsWritable = Omit<MaterialFields, "id"|"inProjects"|"availableAmount">;

export interface ToolFields extends CommonFields, InProjectField, AmountField, AvailableAmountField {
  type: string | null;
  size: string | null;
}
export type ToolFieldsWritable = Omit<ToolFields, "id"|"inProjects"|"availableAmount">;

export type CategoryFields = CommonFields & InProjectField;

export interface ProjectFieldWithAmountUsed<F extends CommonFields> {
  entry: F;
  amountUsed: number;
}

// @todo fix optional values
export interface ProjectFields extends CommonFields {
  instructions?: string;
  notes?: string;
  categories?: CategoryFields[];
  materials?: ProjectFieldWithAmountUsed<MaterialFields>[];
  tools?: ProjectFieldWithAmountUsed<ToolFields>[];
}
export type ProjectFieldsWritable = Omit<ProjectFields, "id">;

export type AllColumnFields = ProjectFields | CategoryFields | MaterialFields | ToolFields;

// @todo fix type
export type TempAnyObject = { [key: string]: any };
