import * as React from "react";
import "./textInputRow.less";
import { RowProps } from "./types";

interface TextInputRowProps extends RowProps {
	type?: string;
	autofocus?: boolean;
}

export class TextInputRow extends React.PureComponent<TextInputRowProps> {
	public render() {
		const { name, value, onChange, type, autofocus } = this.props;
		return (
			<div className="formTextInput">
				<label>{name}</label>
				<input
					type={type ? type : "text"}
					name={name}
					onChange={onChange}
					value={value}
					autoFocus={!!autofocus}
				/>
			</div>
		);
	}
}
