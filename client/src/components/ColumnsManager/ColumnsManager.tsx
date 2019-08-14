import React, { useReducer, useMemo } from "react";
import { MutationFn } from "react-apollo";
import "./columnsManager.less";
import { ProjectColumn } from "../ProjectColumn/ProjectColumn";
import { CategoryColumn } from "../CategoryColumn/CategoryColumn";
import { Popup, PopupMessage } from "../Popup/Popup";
import { CommonFields } from "../../types";
import { ToolColumn } from "../ToolColumn/ToolColumn";
import { MaterialColumn } from "../MaterialColumn/MaterialColumn";
import { FilterTooltip } from "../FilterTooltip/FilterTooltip";
import { reducer, initialState, ReducerType } from "./reducer";
import {
	closePopupAction,
	openPopupAction,
	closeFormAction,
} from "./actions";
import { ReducerContextProvider } from "./context";
import { MainFilterButton } from "../FilterButtonMain/FilterButtonMain";

export const ColumnsManager: React.FC = () => {
	const [ state, dispatch ] = useReducer<ReducerType>(reducer, initialState);
	const { filterTooltipState, popupState } = state;

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

	const closeForm = () => closeFormAction(dispatch);

	const safeDeleteTicket = ({ name, id }: CommonFields, deleteFn: MutationFn<any, { id: string }>) => {
		openDeletePopup(`${PopupMessage.delete} "${name}"?`, id, deleteFn);
	};

	const closeAll = () => {
		closePopup();
		closeForm();
	};

	const columnProps = {
		closeForm,
		openInvalidPopup,
		openChangesPopup,
		safeDeleteTicket,
	};

	// @todo use separate contexts for state and dispatch
	const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

	return (
		<ReducerContextProvider value={contextValue}>
			<MainFilterButton />
			<div className="columnsContainer">
				<ProjectColumn {...columnProps} />
				<CategoryColumn {...columnProps} />
				<ToolColumn {...columnProps} />
				<MaterialColumn {...columnProps} />
				{popupState && (
					<Popup {...popupState} close={closePopup} />
				)}
				{filterTooltipState.props && (
					<FilterTooltip {...filterTooltipState.props} />
				)}
			</div>
		</ReducerContextProvider>
	);
};
