import * as React from "react";
import { MutationFn } from "react-apollo";
import "./login.less";
import { TextInputRow } from "../Form/TextInputRow";
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
						<div className="login">
							<TextInputRow
								name="Email:"
								type="email"
								value={email}
								onChange={this.onChangeUsername}
								autofocus={true}
							/>
							<TextInputRow
								name="Password:"
								type="password"
								value={password}
								onChange={this.onChangePassword}
							/>
							{!isLogin && (
								<TextInputRow
									name="Confirm password:"
									type="password"
									value={confirmPassword}
									onChange={this.onChangeConfirmPassword}
								/>
							)}
							<div className="footer">
								<button
									onClick={isLogin
										? () => this.login(loginUser.mutation)
										: () => this.register(addUser.mutation)
									}
									className={isLoading ? "loading" : ""}
									disabled={isLoading}
								>
									{isLogin ? "Login" : "Register"}
								</button>
							</div>
							<div className={`msg error ${errorMessage ? "" : "hide"}`}>
								{errorMessage}
							</div>
							<div className="msg">
								{isLogin ? REGISTER_MSG : LOGIN_MSG}
								<span className="link" onClick={this.toggleLoginRegister}>here</span>
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

	private login = async (loginMutation: MutationFn<LoginUserData, UserInput>) => {
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

	private register = async (registerMutation: MutationFn<AddUserData, UserInput>) => {
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