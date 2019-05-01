import * as React from "react";
import { MutationFn } from "react-apollo";
import "./formComponents.less";
import { CommonFields } from "../../types";

export type OnChangeFn = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

interface RowProps {
	name: string;
	value: string;
	onChange: OnChangeFn;
}

interface TextInputRowWithListProps {
	name: string;
	options: CommonFields[];
	tags: CommonFields[];
	addOption: MutationFn<any, any>;
}

interface TextInputRowWithListState {
	value: string;
	isValid: boolean;
	showError: boolean;
}

const ADD_TEXT = "+ Add ";
const ERROR_MSG = "Invalid input. Please select a value from the list or add a new value.";

export const TextInputTitle = ({ name, value, onChange }: RowProps) => {
	return (
		<input
			type="text"
			name={name}
			onChange={onChange}
			placeholder="Project name"
			value={value}
			className="formTitle"
		/>
	);
};

export const TextAreaRow = ({ name, value, onChange }: RowProps) => {
	return (
		<div className="formRow">
			<label>{name}</label>
			<textarea
				name={name}
				onChange={onChange}
				value={value}
			/>
		</div>
	);
};

export const TextInputRow = ({ name, value, onChange}: RowProps) => {
	return (
		<div className="formRow">
			<label>{name}</label>
			<input
				type="text"
				name={name}
				onChange={onChange}
				value={value}
				className="withoutDropdown"
			/>
		</div>
	);
};

export class TextInputRowWithList extends React.Component<TextInputRowWithListProps, TextInputRowWithListState> {
	public state: TextInputRowWithListState = {
		value: "",
		isValid: true,
		showError: false,
	};

	public render() {
		const { name, options, tags } = this.props;
		const { value, showError } = this.state;
		/**
		 * @todo add tags below input
		 */
		return (
			<div className="formRow">
				<label>{name}</label>
				<div className="wrapper">
					<div className="errorMsg">
						{showError && ERROR_MSG}
					</div>
					<input
						type="text"
						name={name}
						list={name}
						onChange={this.onChange}
						value={value}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						className={showError ? "error" : ""}
					/>
					{options && (
						<datalist id={name}>
							{value && <option>+ Add {value}</option>}
							{this.renderOptions(options)}
						</datalist>
					)}
				</div>
			</div>
		);
	}

	/**
	 * Options to select taken from database
	 */
	private renderOptions = (arr: CommonFields[]) => {
		return arr.map(({ name }, key) =>
			<option value={name} key={key}/>
		);
	}

	/**
	 * Checks if value is valid and adds new values to db
	 */
	private onChange: OnChangeFn = (e) => {
		const val = e.target.value;

		/**
		 * @todo if option was added, send it to db
		 */
		const wasAddedOption = val.includes(ADD_TEXT);
		if(wasAddedOption) {
			this.props.addOption();
		}
		const wasSelectedOption = !!this.props.options.find(option => option.name === val);
		const result = !wasAddedOption ? val : val.slice(ADD_TEXT.length);

		this.setState({
			value: result,
			isValid: val.length > 0 && (wasAddedOption || wasSelectedOption),
		});
	}

	/**
	 * Shows input error on blur
	 */
	private onBlur = () => {
		const { isValid, showError } = this.state;
		if(!isValid && !showError) {
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
