import { PopupManagerState, FormManagerState, Filter } from "./types";
import { BasicFilterTooltipProps } from "../FilterTooltip/FilterTooltip";

export enum ActionType {
  openFilterTooltip = "openFilterTooltip",
  closeFilterTooltip = "closeFilterTooltip",
  setFilter = "setFilter",
  removeFilter = "removeFilter",
  openPopup = "openPopup",
  closePopup = "closePopup",
  openForm = "openForm",
  closeForm = "closeForm",
}

export interface OpenFilterTooltipAction {
  type: ActionType.openFilterTooltip;
  payload: BasicFilterTooltipProps;
}

export const openFilterTooltipAction = (
  dispatch: React.Dispatch<OpenFilterTooltipAction>,
  payload: BasicFilterTooltipProps,
) => {
  dispatch({ type: ActionType.openFilterTooltip, payload });
};

export interface CloseFilterTooltipAction {
  type: ActionType.closeFilterTooltip;
}

export const closeFilterTooltipAction = (dispatch: React.Dispatch<CloseFilterTooltipAction>) => {
  dispatch({ type: ActionType.closeFilterTooltip });
};

export interface SetFilterAction {
  type: ActionType.setFilter;
  payload: Filter;
}

export const setFilterAction = (dispatch: React.Dispatch<SetFilterAction>, payload: Filter) => {
  dispatch({ type: ActionType.setFilter, payload });
};

export interface RemoveFilterAction {
  type: ActionType.removeFilter;
  payload?: Filter;
}

export const removeFilterAction = (dispatch: React.Dispatch<RemoveFilterAction>, payload?: Filter) => {
  dispatch({ type: ActionType.removeFilter, payload });
};

export interface OpenPopupAction {
  type: ActionType.openPopup;
  payload: Exclude<PopupManagerState, undefined>;
}

export const openPopupAction = (
  dispatch: React.Dispatch<OpenPopupAction>,
  payload: Exclude<PopupManagerState, undefined>,
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
  payload: FormManagerState;
}

export const openFormAction = (
  dispatch: React.Dispatch<OpenFormAction>,
  payload: FormManagerState,
) => {
  dispatch({ type: ActionType.openForm, payload });
};

export interface CloseFormAction {
  type: ActionType.closeForm;
}

export const closeFormAction = (dispatch: React.Dispatch<CloseFormAction>) => {
  dispatch({ type: ActionType.closeForm });
};
