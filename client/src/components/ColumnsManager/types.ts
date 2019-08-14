import { ColumnType, AllColumnFields } from "../../types";
import { BasicFilterTooltipProps } from "../FilterTooltip/FilterTooltip";
import { BasicPopupProps } from "../Popup/Popup";

export type PopupManagerState = BasicPopupProps | undefined;

export interface FormManagerState {
	formOpened: ColumnType;
	formProps?: AllColumnFields;
}

export interface TooltipManagerState {
	activeFilters: string[];
	props?: BasicFilterTooltipProps;
}
