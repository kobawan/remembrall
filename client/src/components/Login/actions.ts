import { LoginState } from "./reducer";

export enum LoginActionType {
  updateField = "updateField",
}

interface UpdateLoginFieldPayload {
  key: keyof LoginState;
  value: LoginState[keyof LoginState];
}

export interface UpdateLoginFieldAction {
  type: LoginActionType.updateField;
  payload: UpdateLoginFieldPayload;
}

export const updateLoginFieldAction = (
  dispatch: React.Dispatch<UpdateLoginFieldAction>,
  payload: UpdateLoginFieldPayload,
) => {
  dispatch({ type: LoginActionType.updateField, payload });
};
