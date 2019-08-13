import { TooltipManagerProps, PopupManagerProps, FormManagerProps } from "./types";

export enum ActionType {
	setFilterTooltip = "setFilterTooltip",
	removeFilterTooltip = "removeFilterTooltip",
	openPopup = "openPopup",
	closePopup = "closePopup",
	openForm = "openForm",
	closeForm = "closeForm",
}

export interface SetFilterTooltipAction {
  type: ActionType.setFilterTooltip;
  payload: Exclude<TooltipManagerProps, undefined>;
}

export const setFilterTooltipAction = (
	dispatch: React.Dispatch<SetFilterTooltipAction>,
	payload: Exclude<TooltipManagerProps, undefined>,
) => {
	dispatch({ type: ActionType.setFilterTooltip, payload });
};

export interface RemoveFilterTooltipAction {
	type: ActionType.removeFilterTooltip;
}

export const removeFilterTooltipAction = (dispatch: React.Dispatch<RemoveFilterTooltipAction>) => {
	dispatch({ type: ActionType.removeFilterTooltip });
};

export interface OpenPopupAction {
	type: ActionType.openPopup;
	payload: Exclude<PopupManagerProps, undefined>;
}

export const openPopupAction = (
	dispatch: React.Dispatch<OpenPopupAction>,
	payload: Exclude<PopupManagerProps, undefined>,
) => {
	dispatch({ type: ActionType.openPopup, payload });
};

export interface ClosePopupAction {
	type: ActionType.closePopup;
}

export const closePopupAction = (dispatch: React.Dispatch<ClosePopupAction>) => {
	dispatch({ type: ActionType.closePopup });
};

export interface OpenFormAction {
	type: ActionType.openForm;
	payload: FormManagerProps;
}

export const openFormAction = (
	dispatch: React.Dispatch<OpenFormAction>,
	payload: FormManagerProps,
) => {
	dispatch({ type: ActionType.openForm, payload });
};

export interface CloseFormAction {
	type: ActionType.closeForm;
}

export const closeFormAction = (dispatch: React.Dispatch<CloseFormAction>) => {
	dispatch({ type: ActionType.closeForm });
};
