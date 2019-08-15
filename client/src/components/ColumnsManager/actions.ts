import { PopupManagerState, FormManagerState } from "./types";
import { BasicFilterTooltipProps, FilterType } from "../FilterTooltip/FilterTooltip";

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
  payload: FilterType;
}

export const setFilterAction = (dispatch: React.Dispatch<SetFilterAction>, payload: FilterType) => {
  dispatch({ type: ActionType.setFilter, payload });
};

export interface RemoveFilterAction {
  type: ActionType.removeFilter;
  payload?: FilterType;
}

export const removeFilterAction = (dispatch: React.Dispatch<RemoveFilterAction>, payload?: FilterType) => {
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
