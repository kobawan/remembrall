import React from "react";
import "./textInputRowWithUnit.less";
import { RowProps } from "./types";

interface InputRowWithUnitProps extends RowProps {
	type?: string;
	autofocus?: boolean;
	options: string[];
	unitValue: string;
}

export const InputRowWithUnit = (({
	name,
	value,
	onChange,
	type,
	autofocus,
	options,
	unitValue,
}: InputRowWithUnitProps) => {
	const renderOptions = () => {
		return options.map((value, i) => (
			<option value={value} key={i}>
				{value}
			</option>
		));
	};
	return (
		<div className="formTextInputWithUnit">
			<label>{name}</label>
			<div className="formTextInputContainer">
				<input
					type={type ? type : "text"}
					name={name}
					onChange={onChange}
					value={value}
					autoFocus={!!autofocus}
					className="mainInput"
				/>
				<select
					className="unitsSelect"
					onChange={onChange}
					name="measurement"
					defaultValue={unitValue}
				>
					{renderOptions()}
				</select>
			</div>
		</div>
	);
});
