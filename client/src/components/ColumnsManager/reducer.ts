import React from "react";
import {
	OpenFilterTooltipAction,
	CloseFilterTooltipAction,
	OpenPopupAction,
	ClosePopupAction,
	ActionType,
	OpenFormAction,
	CloseFormAction,
} from "./actions";
import { TooltipManagerProps, PopupManagerProps, FormManagerProps } from "./types";

export type Actions = (
	OpenFilterTooltipAction
	| CloseFilterTooltipAction
	| OpenPopupAction
	| ClosePopupAction
	| OpenFormAction
	| CloseFormAction
);

export interface State {
	filterTooltipState: TooltipManagerProps;
	popupState: PopupManagerProps;
	formState: Partial<FormManagerProps>;
}

export const initialState: State = {
	filterTooltipState: undefined,
	popupState: undefined,
	formState: {},
};

export type ReducerType = React.Reducer<State, Actions>;

export const reducer: ReducerType = (state, action) => {
  switch (action.type) {
    case ActionType.openFilterTooltip:
			return { ...state, filterTooltipState: action.payload };
		case ActionType.closeFilterTooltip:
			return { ...state, filterTooltipState: undefined };
		case ActionType.openPopup:
			return { ...state, popupState: action.payload };
		case ActionType.closePopup:
			return { ...state, popupState: undefined };
		case ActionType.openForm:
			return { ...state, formState: action.payload };
		case ActionType.closeForm:
			return { ...state, formState: {} };
    default:
      return state;
  }
};
