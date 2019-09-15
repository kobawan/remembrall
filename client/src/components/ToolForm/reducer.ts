import React from "react";
import { ToolFieldsWritable } from "../../types";
import { UpdateToolFieldAction, ToolActionType } from "./actions";

export enum Measurements {
  mm = "mm",
  us = "us",
  uk = "uk",
}

type ToolActions = (
  UpdateToolFieldAction
);

export type ToolState = ToolFieldsWritable & { measurement: Measurements };

export const initialToolState: ToolState = {
  name: "",
  amount: 1,
  type: null,
  size: null,
  measurement: Measurements.mm,
};

export type ToolReducerType = React.Reducer<ToolState, ToolActions>;

export const toolReducer: ToolReducerType = (state, action) => {
  switch (action.type) {
    case ToolActionType.updateField:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};
