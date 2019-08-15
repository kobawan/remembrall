import React, { useReducer } from "react";
import cx from "classnames";
import * as styles from "./login.less";
import { RowInput } from "../Form/RowInput";
import { useLoginRegisterMutations } from "./LoginWrapper";
import { loginReducer, LoginReducerType, initialLoginState } from "./reducer";
import { updateLoginFieldAction } from "./actions";
import { logErrors } from "../../utils/errorHandling";

enum ErrorMessage {
  EmptyField = "One of the required fields is empty.",
  WrongFields = "Email or password are incorrect.",
  ConfirmPasswordMatch = "Password confirmation doesn't match. Please type it again.",
  SomethingWrong = "Oops, something went wrong, please try again."
}

const REGISTER_MSG = "Don't have an account? Create one ";
const LOGIN_MSG = "Already have an account? Log in ";

interface LoginProps {
  updateLoginState: () => void;
}

export const Login: React.FC<LoginProps> = ({ updateLoginState }) => {
  const [
    { email, password, errorMessage, isLogin, confirmPassword },
    dispatch,
  ] = useReducer<LoginReducerType>(loginReducer, initialLoginState);
  const [[loginUser, loginRes], [registerUser, registerRes]] = useLoginRegisterMutations();

  logErrors(loginRes.error, registerRes.error);
  const isLoading = loginRes.loading || registerRes.loading;

  const showError = (value: ErrorMessage) => {
    updateLoginFieldAction(dispatch, { key: "errorMessage", value });
  };

  const verifyFields = () => {
    if(password.length === 0 || email.length === 0 || !isLogin && confirmPassword.length === 0) {
      showError(ErrorMessage.EmptyField);
      return false;
    }

    if(!isLogin && password !== confirmPassword) {
      showError(ErrorMessage.ConfirmPasswordMatch);
      return false;
    }

    return true;
  };

  const login = async () => {
    const res = await loginUser({ variables: { password, email } });
    if(!res || !res.data) {
      showError(ErrorMessage.SomethingWrong);
      return false;
    }

    if(!res.data.loginUser) {
      showError(ErrorMessage.WrongFields);
      return false;
    }

    return true;
  };

  const register = async () => {
    const res = await registerUser({ variables: { password, email } });
    if(!res || !res.data) {
      showError(ErrorMessage.SomethingWrong);
      return false;
    }

    if(!res.data.addUser) {
      showError(ErrorMessage.WrongFields);
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if(!verifyFields()) {
      return;
    }

    const action = isLogin ? login : register;
    const isSuccess = await action();

    if (isSuccess) {
      updateLoginState();
    }
  };

  return (
    <div className={styles.login}>
      <RowInput
        name="Email:"
        type="email"
        value={email}
        onChange={({ currentTarget: { value } }) => {
          updateLoginFieldAction(dispatch, { key: "email", value });
        }}
        autofocus={true}
      />
      <RowInput
        name="Password:"
        type="password"
        value={password}
        onChange={({ currentTarget: { value } }) => {
          updateLoginFieldAction(dispatch, { key: "password", value });
        }}
      />
      {!isLogin && (
        <RowInput
          name="Confirm password:"
          type="password"
          value={confirmPassword}
          onChange={({ currentTarget: { value } }) => {
            updateLoginFieldAction(dispatch, { key: "confirmPassword", value });
          }}
        />
      )}
      <div className={styles.footer}>
        <button
          onClick={onSubmit}
          className={cx(isLoading && styles.loading)}
          disabled={isLoading}
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <div className={cx(styles.msg, styles.error, !errorMessage && styles.hide)}>
          {errorMessage}
        </div>
        <div className={styles.msg}>
          {isLogin ? REGISTER_MSG : LOGIN_MSG}
          <span
            className={styles.link}
            onClick={() => updateLoginFieldAction(dispatch, { key: "isLogin", value: !isLogin })}
          >
            here
          </span>
        </div>
      </div>
    </div>
  );
};
