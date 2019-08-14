import { ProjectState } from "./reducer";

export enum ProjectActionType {
	updateField = "updateField",
}

interface UpdateProjectFieldPayload {
	key: keyof ProjectState;
	value: ProjectState[keyof ProjectState];
}

export interface UpdateProjectFieldAction {
  type: ProjectActionType.updateField;
  payload: UpdateProjectFieldPayload;
}

export const updateProjectFieldAction = (
	dispatch: React.Dispatch<UpdateProjectFieldAction>,
	payload: UpdateProjectFieldPayload,
) => {
	dispatch({ type: ProjectActionType.updateField, payload });
};
