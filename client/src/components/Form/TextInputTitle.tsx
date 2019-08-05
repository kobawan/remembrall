import React, { useState, useCallback } from "react";
import "./textInputTitle.less";
import { RowProps } from "./types";

const TITLE_ERROR_MSG = "Invalid input. Title field is required";

interface TextInputTitleProps extends RowProps {
	placeholder?: string;
}

export const TextInputTitle = React.memo(({ name, value, onChange, placeholder }: TextInputTitleProps) => {
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
				className={showError ? "error" : ""}
				onBlur={onBlur}
				onFocus={onFocus}
			/>
			<div className="errorMsg">
				{showError && TITLE_ERROR_MSG}
			</div>
		</div>
	);
});
