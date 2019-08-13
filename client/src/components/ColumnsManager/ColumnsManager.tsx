import React, { useState } from "react";
import "./columnsManager.less";
import { ProjectColumn } from "../ProjectColumn/ProjectColumn";
import { CategoryColumn } from "../CategoryColumn/CategoryColumn";
import { Popup, PopupMessage } from "../Popup/Popup";
import { MutationFn } from "react-apollo";
import {
	CommonFields,
	ColumnType,
	FormPropsType,
} from "../../types";
import { ToolColumn } from "../ToolColumn/ToolColumn";
import { MaterialColumn } from "../MaterialColumn/MaterialColumn";
import { TicketTooltip, BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";

interface PopupManagerProps {
	popupText?: string;
	popupAction?: () => void;
}
interface FormManagerProps {
	formOpened?: ColumnType;
	formProps?: FormPropsType;
}
type TooltipManagerProps = BasicTicketTooltipProps | undefined;

export const ColumnsManager: React.FC = () => {
	const [tooltipProps, setTooltipProps] = useState<TooltipManagerProps>(undefined);
	const [
		{ popupText, popupAction },
		setPopupProps,
	] = useState<PopupManagerProps>({ popupText: undefined, popupAction: undefined });
	const [
		{ formOpened, formProps },
		setFormProps,
	] = useState<FormManagerProps>({ formOpened: undefined, formProps: undefined });

	const showTooltip = (props: BasicTicketTooltipProps) => setTooltipProps(props);
	const closeTooltip = () => setTooltipProps(undefined);

	const closePopup = () => setPopupProps({ popupText: undefined, popupAction: undefined });
	const openChangesPopup = () => setPopupProps({
		popupText: PopupMessage.changes,
		popupAction: closeAll,
	});
	const openInvalidPopup = () => setPopupProps({ popupText: PopupMessage.invalid });
	const openDeletePopup = (popupText: string, id: string, deleteFn: MutationFn<any, { id: string }>) => {
		const popupAction = () => {
			closeAll();
			deleteFn({ variables: { id } });
		};
		setPopupProps({ popupText, popupAction });
	};

	const openForm = (formOpened: ColumnType, formProps?: FormPropsType) => setFormProps({ formOpened, formProps });
	const closeForm = () => setFormProps({ formOpened: undefined, formProps: undefined });

	const safeDeleteTicket = ({ name, id }: CommonFields, deleteFn: MutationFn<any, { id: string }>) => {
		openDeletePopup(`${PopupMessage.delete} "${name}"?`, id, deleteFn);
	};

	const closeAll = () => {
		closePopup();
		closeForm();
	};

	const columnProps = {
		safeDeleteTicket,
		openForm,
		formOpened,
		formProps,
		closeForm,
		openInvalidPopup,
		openChangesPopup,
		showTooltip,
		closeTooltip,
	};

	return (
		<div className="columnsContainer">
			<ProjectColumn {...columnProps} />
			<CategoryColumn {...columnProps} />
			<ToolColumn {...columnProps} />
			<MaterialColumn {...columnProps} />
			<Popup
				text={popupText}
				close={closePopup}
				action={popupAction}
			/>
			{tooltipProps && (
				<TicketTooltip {...tooltipProps} closeTooltip={closeTooltip} />
			)}
		</div>
	);
};
