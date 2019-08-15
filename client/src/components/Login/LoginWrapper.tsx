import React from "react";
import { adopt } from "react-adopt";
import { Mutation, MutationFunction, MutationResult } from "react-apollo";
import { MutationRenderProps } from "../../types";
import { LOGIN_USER, ADD_USER } from "./loginQueries";
import { setStorageKey, StorageKeys } from "../../utils/localStorage";

export interface LoginUserData {
  loginUser: { id: string } | null;
}

export interface AddUserData {
  addUser: { id: string };
}

export interface UserInput {
  email: string;
  password: string;
}

export interface LoginRenderProps {
  loginUser: MutationRenderProps<LoginUserData, UserInput>;
  addUser: MutationRenderProps<AddUserData, UserInput>;
}

const onLoginCompleted = ({ loginUser }: LoginUserData) => {
  if(loginUser) {
    setStorageKey(StorageKeys.UserId, loginUser.id);
  }
};

const onRegisterCompleted = ({ addUser }: AddUserData) => {
  setStorageKey(StorageKeys.UserId, addUser.id);
};

export const LoginWrapper = adopt<LoginRenderProps, {}>({
  loginUser: ({ render }) => (
    <Mutation mutation={LOGIN_USER} onCompleted={onLoginCompleted}>
      {(mutation: MutationFunction<LoginUserData, UserInput>, res: MutationResult<LoginUserData>) => {
        return render!({ mutation, res });
      }}
    </Mutation>
  ),
  addUser: ({ render }) => (
    <Mutation mutation={ADD_USER} onCompleted={onRegisterCompleted}>
      {(mutation: MutationFunction<AddUserData, UserInput>, res: MutationResult<AddUserData>) => {
        return render!({ mutation, res });
      }}
    </Mutation>
  ),
});
