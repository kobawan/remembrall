import React, { useReducer } from "react";
import { MutationFn } from "react-apollo";
import "./columnsManager.less";
import { ProjectColumn } from "../ProjectColumn/ProjectColumn";
import { CategoryColumn } from "../CategoryColumn/CategoryColumn";
import { Popup, PopupMessage } from "../Popup/Popup";
import { CommonFields } from "../../types";
import { ToolColumn } from "../ToolColumn/ToolColumn";
import { MaterialColumn } from "../MaterialColumn/MaterialColumn";
import { TicketTooltip, BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";
import { reducer, initialState, ReducerType } from "./reducer";
import {
	setFilterTooltipAction,
	removeFilterTooltipAction,
	closePopupAction,
	openPopupAction,
	openFormAction,
	closeFormAction,
} from "./actions";
import { FormManagerProps } from "./types";

export const ColumnsManager: React.FC = () => {
	const [
		{ filterTooltipState, popupState, formState },
		dispatch,
	] = useReducer<ReducerType>(reducer, initialState);

	const showTooltip = (props: BasicTicketTooltipProps) => setFilterTooltipAction(dispatch, props);
	const closeTooltip = () => removeFilterTooltipAction(dispatch);

	const closePopup = () => closePopupAction(dispatch);
	const openChangesPopup = () => openPopupAction(dispatch, {
		text: PopupMessage.changes,
		action: closeAll,
	});
	const openInvalidPopup = () => openPopupAction(dispatch, { text: PopupMessage.invalid });
	const openDeletePopup = (text: string, id: string, deleteFn: MutationFn<any, { id: string }>) => {
		const action = () => {
			closeAll();
			deleteFn({ variables: { id } });
		};
		openPopupAction(dispatch, { text, action });
	};

	const openForm = (props: FormManagerProps) => openFormAction(dispatch, props);
	const closeForm = () => closeFormAction(dispatch);

	const safeDeleteTicket = ({ name, id }: CommonFields, deleteFn: MutationFn<any, { id: string }>) => {
		openDeletePopup(`${PopupMessage.delete} "${name}"?`, id, deleteFn);
	};

	const closeAll = () => {
		closePopup();
		closeForm();
	};

	const columnProps = {
		...formState,
		openForm,
		closeForm,
		openInvalidPopup,
		openChangesPopup,
		showTooltip,
		closeTooltip,
		safeDeleteTicket,
	};

	return (
		<div className="columnsContainer">
			<ProjectColumn {...columnProps} />
			<CategoryColumn {...columnProps} />
			<ToolColumn {...columnProps} />
			<MaterialColumn {...columnProps} />
			{popupState && (
				<Popup {...popupState} close={closePopup} />
			)}
			{filterTooltipState && (
				<TicketTooltip {...filterTooltipState} closeTooltip={closeTooltip} />
			)}
		</div>
	);
};
