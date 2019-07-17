import React from "react";
import "./textAreaRow.less";
import { RowProps } from "./types";

export const TextAreaRow = React.memo(({ name, value, onChange }: RowProps) => {
	return (
		<div className="formTextarea">
			<label>{name}</label>
			<textarea
				name={name}
				onChange={onChange}
				value={value}
			/>
		</div>
	);
});
