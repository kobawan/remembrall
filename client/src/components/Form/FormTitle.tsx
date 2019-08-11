import React, { useState, useCallback } from "react";
import "./formTitle.less";
import { RowProps } from "./types";

const TITLE_ERROR_MSG = "Invalid input. Title field is required";

interface FormTitleProps extends RowProps {
	placeholder?: string;
}

export const FormTitle = React.memo(({ name, value, onChange, placeholder }: FormTitleProps) => {
	const [ showError, setShowError ] = useState(false);

	const onBlur = useCallback(() => {
		if(value.length === 0 && !showError) {
			setShowError(true);
		}
	}, [value, showError]);

	const onFocus = useCallback(() => {
		if(showError) {
			setShowError(false);
		}
	}, [showError]);

	return (
		<div className="formTitle">
			<input
				type="text"
				name={name}
				onChange={onChange}
				placeholder={placeholder}
				value={value}
				className={`rowInputTitle ${showError ? "error" : ""}`}
				onBlur={onBlur}
				onFocus={onFocus}
			/>
			<div className="rowInputTitleError">
				{showError && TITLE_ERROR_MSG}
			</div>
		</div>
	);
});
