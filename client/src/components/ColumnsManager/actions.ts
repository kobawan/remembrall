import { TooltipManagerProps, PopupManagerProps, FormManagerProps } from "./types";

export enum ActionType {
	openFilterTooltip = "openFilterTooltip",
	closeFilterTooltip = "closeFilterTooltip",
	openPopup = "openPopup",
	closePopup = "closePopup",
	openForm = "openForm",
	closeForm = "closeForm",
}

export interface OpenFilterTooltipAction {
  type: ActionType.openFilterTooltip;
  payload: Exclude<TooltipManagerProps, undefined>;
}

export const openFilterTooltipAction = (
	dispatch: React.Dispatch<OpenFilterTooltipAction>,
	payload: Exclude<TooltipManagerProps, undefined>,
) => {
	dispatch({ type: ActionType.openFilterTooltip, payload });
};

export interface CloseFilterTooltipAction {
	type: ActionType.closeFilterTooltip;
}

export const closeFilterTooltipAction = (dispatch: React.Dispatch<CloseFilterTooltipAction>) => {
	dispatch({ type: ActionType.closeFilterTooltip });
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
