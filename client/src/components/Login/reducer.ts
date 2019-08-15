import React from "react";
import { UpdateLoginFieldAction, LoginActionType } from "./actions";

type LoginActions = (
  UpdateLoginFieldAction
);

export interface LoginState {
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage?: string;
  isLogin: boolean;
}

export const initialLoginState: LoginState = {
  email: "",
  password: "",
  confirmPassword: "",
  isLogin: true,
};

export type LoginReducerType = React.Reducer<LoginState, LoginActions>;

export const loginReducer: LoginReducerType = (state, action) => {
  switch (action.type) {
    case LoginActionType.updateField:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};
