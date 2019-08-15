import { MutationTuple } from "react-apollo";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER, ADD_USER } from "./loginQueries";
import { setStorageKey, StorageKeys } from "../../utils/localStorage";

interface LoginUserData {
  loginUser: { id: string } | null;
}

interface AddUserData {
  addUser: { id: string };
}

interface UserInput {
  email: string;
  password: string;
}

type UseLoginRegisterMutationsRes = [
  MutationTuple<LoginUserData, UserInput>,
  MutationTuple<AddUserData, UserInput>,
];

const onLoginCompleted = ({ loginUser }: LoginUserData) => {
  if(loginUser) {
    setStorageKey(StorageKeys.UserId, loginUser.id);
  }
};

const onRegisterCompleted = ({ addUser }: AddUserData) => {
  setStorageKey(StorageKeys.UserId, addUser.id);
};

export const useLoginRegisterMutations = (): UseLoginRegisterMutationsRes => {
  return [
    useMutation(LOGIN_USER, { onCompleted: onLoginCompleted }),
    useMutation(ADD_USER, { onCompleted: onRegisterCompleted }),
  ];
};
