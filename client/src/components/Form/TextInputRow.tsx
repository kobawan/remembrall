import React from "react";
import "./textInputRow.less";
import { RowProps } from "./types";

interface TextInputRowProps extends RowProps {
	type?: string;
	autofocus?: boolean;
}

export const TextInputRow = React.memo(({ name, value, onChange, type, autofocus }: TextInputRowProps) => {
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
});
