import { ColumnType, AllColumnFields, CommonFields, InProjectField } from "../../types";
import { BasicFilterTooltipProps, FilterType } from "../FilterTooltip/FilterTooltip";
import { BasicPopupProps } from "../Popup/Popup";

export type PopupManagerState = BasicPopupProps | undefined;

export interface FormManagerState {
  formOpened: ColumnType;
  formProps?: AllColumnFields;
}

export interface Filter {
  type: FilterType;
  ticket?: CommonFields & InProjectField;
}

export interface TooltipManagerState {
  activeFilters: Filter[];
  props?: BasicFilterTooltipProps;
}
