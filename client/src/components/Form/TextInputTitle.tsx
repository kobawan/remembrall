import * as React from "react";
import "./textInputTitle.less";
import { RowProps } from "./types";

const TITLE_ERROR_MSG = "Invalid input. Title field is required";

interface TextInputTitleState {
	showError: boolean;
}

export class TextInputTitle extends React.PureComponent<RowProps, TextInputTitleState> {
	public state: TextInputTitleState = {
		showError: false,
	};

	public render() {
		const { name, value, onChange } = this.props;
		const { showError } = this.state;
		return (
			<div className="formTitle">
				<input
					type="text"
					name={name}
					onChange={onChange}
					placeholder="Project name"
					value={value}
					className={showError ? "error" : ""}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
				/>
				<div className="errorMsg">
					{showError && TITLE_ERROR_MSG}
				</div>
			</div>
		);
	}

	/**
	 * Shows input error on blur
	 */
	private onBlur = () => {
		const { showError } = this.state;
		const { value } = this.props;
		if(value.length === 0 && !showError) {
			this.setState({ showError: true });
		}
	}

	/**
	 * Hides input error on focus
	 */
	private onFocus = () => {
		if(this.state.showError) {
			this.setState({ showError: false });
		}
	}
}
