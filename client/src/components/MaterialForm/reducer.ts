import React from "react";
import { MaterialFieldsWritable } from "../../types";
import { UpdateMaterialFieldAction, MaterialActionType } from "./actions";

type MaterialActions = (
  UpdateMaterialFieldAction
);

export type MaterialState = MaterialFieldsWritable;

export const initialMaterialState: MaterialState = {
  name: "",
  amount: 1,
  color: null,
};

export type MaterialReducerType = React.Reducer<MaterialState, MaterialActions>;

export const materialReducer: MaterialReducerType = (state, action) => {
  switch (action.type) {
    case MaterialActionType.updateField:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};
