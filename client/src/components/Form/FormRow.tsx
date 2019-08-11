import React from "react";
import "./formRow.less";

interface FormRowProps {
	name: string;
	isRequired?: boolean;
	direction?: FormRowDirection;
}

export enum FormRowDirection {
	row = "row",
	column = "column",
}

export const FormRow: React.FC<FormRowProps> = (({
	name,
	isRequired,
	direction = FormRowDirection.row,
	children,
}) => {
	return (
		<div className="formRow">
			<label className="formRowLabel">{`${name}${isRequired ? " *" : ""}`}</label>
			<div className={`formRowContent ${direction}`}>
				{children}
			</div>
		</div>
	);
});
