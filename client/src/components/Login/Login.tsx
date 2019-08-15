import React from "react";
import { MutationFunction } from "react-apollo";
import cx from "classnames";
import * as styles from "./login.less";
import { RowInput } from "../Form/RowInput";
import { OnChangeFn } from "../Form/types";
import { LoginWrapper, LoginUserData, UserInput, AddUserData } from "./LoginWrapper";
import { logErrors } from "../../utils/errorHandling";

enum ErrorMessage {
  EmptyField = "One of the required fields is empty.",
  WrongFields = "Email or password are incorrect.",
  ConfirmPasswordMatch = "Password confirmation doesn't match. Please type it again."
}

const REGISTER_MSG = "Don't have an account? Create one ";
const LOGIN_MSG = "Already have an account? Log in ";

interface LoginProps {
  updateLoginState: () => void;
}

interface LoginState {
  email: string;
  password: string;
  confirmPassword: string;
  errorMessage?: string;
  isLogin: boolean;
}

export class Login extends React.PureComponent<LoginProps, LoginState> {
  public state: LoginState = {
    email: "",
    password: "",
    confirmPassword: "",
    isLogin: true,
  };

  public render() {
    const { email, password, errorMessage, isLogin, confirmPassword } = this.state;
    return (
      <LoginWrapper>
        {({ loginUser, addUser }) => {
          logErrors(undefined, loginUser, addUser);
          const isLoading = loginUser.res.loading || addUser.res.loading;

          return (
            <div className={styles.login}>
              <RowInput
                name="Email:"
                type="email"
                value={email}
                onChange={this.onChangeUsername}
                autofocus={true}
              />
              <RowInput
                name="Password:"
                type="password"
                value={password}
                onChange={this.onChangePassword}
              />
              {!isLogin && (
                <RowInput
                  name="Confirm password:"
                  type="password"
                  value={confirmPassword}
                  onChange={this.onChangeConfirmPassword}
                />
              )}
              <div className={styles.footer}>
                <button
                  onClick={isLogin
                    ? () => this.login(loginUser.mutation)
                    : () => this.register(addUser.mutation)
                  }
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
                  <span className={styles.link} onClick={this.toggleLoginRegister}>here</span>
                </div>
              </div>
            </div>
          );
        }}
      </LoginWrapper>
    );
  }

  private toggleLoginRegister = () => {
    this.setState({ isLogin: !this.state.isLogin });
  }

  private onChangeUsername: OnChangeFn = (e) => {
    this.setState({ email: e.currentTarget.value });
  }

  private onChangePassword: OnChangeFn = (e) => {
    this.setState({ password: e.currentTarget.value });
  }

  private onChangeConfirmPassword: OnChangeFn = (e) => {
    this.setState({ confirmPassword: e.currentTarget.value });
  }

  private login = async (loginMutation: MutationFunction<LoginUserData, UserInput>) => {
    const { email, password } = this.state;
    if(!this.verifyFields()) {
      return;
    }

    const res = await loginMutation({ variables: { password, email } });
    if(!res || !res.data) {
      return;
    }

    if(!res.data.loginUser) {
      this.setState({ errorMessage: ErrorMessage.WrongFields });
      return;
    }

    this.props.updateLoginState();
  }

  private register = async (registerMutation: MutationFunction<AddUserData, UserInput>) => {
    const { email, password } = this.state;
    if(!this.verifyFields()) {
      return;
    }

    const res = await registerMutation({ variables: { password, email } });
    if(!res || !res.data) {
      return;
    }

    if(!res.data.addUser) {
      this.setState({ errorMessage: ErrorMessage.WrongFields });
      return;
    }

    this.props.updateLoginState();
  }

  private verifyFields = () => {
    const { email, password, isLogin, confirmPassword } = this.state;

    if(password.length === 0 || email.length === 0 || !isLogin && confirmPassword.length === 0) {
      this.setState({ errorMessage: ErrorMessage.EmptyField });
      return false;
    }

    if(!isLogin && password !== confirmPassword) {
      this.setState({ errorMessage: ErrorMessage.ConfirmPasswordMatch });
      return false;
    }

    return true;
  }
}