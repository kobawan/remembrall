import { MaterialState } from "./reducer";

export enum MaterialActionType {
  updateField = "updateField",
}

interface UpdateMaterialFieldPayload {
  key: keyof MaterialState;
  value: MaterialState[keyof MaterialState];
}

export interface UpdateMaterialFieldAction {
  type: MaterialActionType.updateField;
  payload: UpdateMaterialFieldPayload;
}

export const updateMaterialFieldAction = (
  dispatch: React.Dispatch<UpdateMaterialFieldAction>,
  payload: UpdateMaterialFieldPayload,
) => {
  dispatch({ type: MaterialActionType.updateField, payload });
};
