import { ToolState } from "./reducer";

export enum ToolActionType {
	updateField = "updateField",
}

interface UpdateToolFieldPayload {
	key: keyof ToolState;
	value: ToolState[keyof ToolState];
}

export interface UpdateToolFieldAction {
  type: ToolActionType.updateField;
  payload: UpdateToolFieldPayload;
}

export const updateToolFieldAction = (
	dispatch: React.Dispatch<UpdateToolFieldAction>,
	payload: UpdateToolFieldPayload,
) => {
	dispatch({ type: ToolActionType.updateField, payload });
};
