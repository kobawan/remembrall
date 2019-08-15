import React from "react";
import {
  OpenFilterTooltipAction,
  CloseFilterTooltipAction,
  OpenPopupAction,
  ClosePopupAction,
  ActionType,
  OpenFormAction,
  CloseFormAction,
  SetFilterAction,
  RemoveFilterAction,
} from "./actions";
import { TooltipManagerState, PopupManagerState, FormManagerState } from "./types";

export type Actions = (
  OpenFilterTooltipAction
  | CloseFilterTooltipAction
  | OpenPopupAction
  | ClosePopupAction
  | OpenFormAction
  | CloseFormAction
  | SetFilterAction
  | RemoveFilterAction
);

export interface State {
  filterTooltipState: TooltipManagerState;
  popupState: PopupManagerState;
  formState: Partial<FormManagerState>;
}

export const initialState: State = {
  filterTooltipState: { activeFilters: [] },
  popupState: undefined,
  formState: {},
};

export type ReducerType = React.Reducer<State, Actions>;

export const reducer: ReducerType = (state, action) => {
  switch (action.type) {
    case ActionType.openFilterTooltip:
      return {
        ...state,
        filterTooltipState: {
          ...state.filterTooltipState,
          props: action.payload,
        },
      };
    case ActionType.closeFilterTooltip:
      return {
        ...state,
        filterTooltipState: {
          ...state.filterTooltipState,
          props: undefined,
        },
      };
    case ActionType.setFilter:
      if (state.filterTooltipState.activeFilters.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        filterTooltipState: {
          ...state.filterTooltipState,
          activeFilters: [...state.filterTooltipState.activeFilters, action.payload],
        },
      };
    case ActionType.removeFilter:
      if (!action.payload) {
        return {
          ...state,
          filterTooltipState: {
            ...state.filterTooltipState,
            activeFilters: [],
          },
        };
      }
      if (!state.filterTooltipState.activeFilters.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        filterTooltipState: {
          ...state.filterTooltipState,
          activeFilters: state.filterTooltipState.activeFilters.filter(filter => filter !== action.payload),
        },
      };
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
