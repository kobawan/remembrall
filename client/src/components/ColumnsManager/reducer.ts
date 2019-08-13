import React from "react";
import {
	SetFilterTooltipAction,
	RemoveFilterTooltipAction,
	OpenPopupAction,
	ClosePopupAction,
	ActionType,
	OpenFormAction,
	CloseFormAction,
} from "./actions";
import { TooltipManagerProps, PopupManagerProps, FormManagerProps } from "./types";

type Actions = (
	SetFilterTooltipAction
	| RemoveFilterTooltipAction
	| OpenPopupAction
	| ClosePopupAction
	| OpenFormAction
	| CloseFormAction
);

interface State {
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
    case ActionType.setFilterTooltip:
			return { ...state, filterTooltipState: action.payload };
		case ActionType.removeFilterTooltip:
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
