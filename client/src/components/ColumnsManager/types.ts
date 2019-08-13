import { ColumnType, FormPropsType } from "../../types";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";
import { BasicPopupProps } from "../Popup/Popup";

export type PopupManagerProps = BasicPopupProps | undefined;

export interface FormManagerProps {
	formOpened: ColumnType;
	formProps?: FormPropsType;
}

export type TooltipManagerProps = BasicTicketTooltipProps | undefined;
