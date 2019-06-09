import * as React from "react";
import { MutationFn } from "react-apollo";
import "./formComponents.less";
import { CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";

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
	updateTags: (tags: CommonFields[]) => void;
	isRequired?: boolean;
}

interface TextInputRowWithListState {
	value: string;
	valueFromDb?: CommonFields;
	hideOptions: boolean;
	editTags: boolean;
}

interface TextInputTitleState {
	showError: boolean;
}

const ADD_TEXT = "+ Add ";
const TITLE_ERROR_MSG = "Invalid input. Title field is required";

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

export class TextInputRowWithList extends React.Component<TextInputRowWithListProps, TextInputRowWithListState> {
	public state: TextInputRowWithListState = {
		value: "",
		hideOptions: false,
		editTags: false,
	};
	private textAreaRef = React.createRef<HTMLInputElement>();

	public render() {
		const { name, options, isRequired, tags } = this.props;
		const { value, hideOptions, editTags } = this.state;
		/**
		 * @todo add tags below input
		 */
		return (
			<div className="formRow">
				<label>{`${name}${isRequired ? " *" : ""}`}</label>
				<div className="wrapper">
					{editTags && (
						<input
							type="text"
							ref={this.textAreaRef}
							name={name}
							list={name}
							onChange={this.onChange}
							value={value}
							onKeyUp={this.addTagOnEnter}
							onBlur={this.addTagOnEnterOrBlur}
						/>
					)}
					<div className="tags">
						{!editTags && (
							<div className="open" onClick={this.toggleEditing}>
								{plusSvg}
							</div>
						)}
						{this.renderTags(tags)}
					</div>
					{!hideOptions && (
						<datalist id={name}>
							{this.renderAddOption()}
							{this.renderOptions(options)}
						</datalist>
					)}
				</div>
			</div>
		);
	}

	/**
	 * Disables/enables with focus on the input
	 */
	private toggleEditing = async () => {
		await this.setState({ editTags: !this.state.editTags });
		if(this.textAreaRef.current) {
			this.textAreaRef.current.focus();
		}
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
	 * Shows ad option if there is an input value and it doesn't exist in db
	 */
	private renderAddOption = () => {
		const value = this.state.value;
		if(value && !this.getOptionFromDb(value)) {
			return (<option>+ Add {value}</option>);
		}
		return null;
	}

	/**
	 * Tags chosen by the user
	 */
	private renderTags = (arr: CommonFields[]) => {
		return arr.map(({ name }, key) =>
			<div className="tag" key={key}>
				<span>{name}</span>
				<div className="close" onClick={this.removeTag}>
					{plusSvg}
				</div>
			</div>
		);
	}

	/**
	 * Checks if value is valid and adds new values to db
	 */
	private onChange: OnChangeFn = async (e) => {
		const val = e.currentTarget.value;

		const wasAddedOption = val.includes(ADD_TEXT);
		const name = !wasAddedOption ? val : val.slice(ADD_TEXT.length);
		if(name.length > 0 && wasAddedOption) {
			await this.addNewValueToDb(name);
			return;
		}

		const valueFromDb = this.getOptionFromDb(val);
		if(name.length > 0 && valueFromDb) {
			this.setState({
				value: valueFromDb.name,
				valueFromDb,
			});
			return;
		}

		this.setState({
			value: name,
			valueFromDb: undefined,
			hideOptions: false,
		});
	}

	private addNewValueToDb = async (name: string) => {
		const res = await this.props.addOption({ variables: { params: { name: name.toLowerCase() } } });
		if(!res || !res.data) {
			console.error(`Adding "${name}" to database has failed.`, res);
			return;
		}
		// So component doesn't know name of mutation
		const dbvalues = res.data[Object.keys(res.data)[0]];
		this.addTag(dbvalues);
	}

	/**
	 * Adds tag on enter
	 */
	private addTagOnEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if(e.keyCode === 13) {
			await this.addTagOnEnterOrBlur();
		}
	}

	private addTagOnEnterOrBlur = async () => {
		if(this.state.valueFromDb) {
			// value is already in db
			this.addTag(this.state.valueFromDb);
		} else {
			// value needs to be added to db and then to the tag
			if(this.state.value.length > 0) {
				await this.addNewValueToDb(this.state.value);
			}
		}
		this.toggleEditing();
	}

	/**
	 * Adds tags and resets the state
	 */
	private addTag = (tag: CommonFields) => {
		if(this.props.tags.filter(res => res.name === tag.name).length === 0) {
			this.props.updateTags([tag].concat(this.props.tags));
		}
		this.setState({
			value: "",
			valueFromDb: undefined,
			hideOptions: true,
		});
	}

	/**
	 * Removes tag on click event
	 */
	private removeTag = (e: React.MouseEvent<HTMLDivElement>) => {
		const tagName = (e.currentTarget.previousSibling as HTMLSpanElement).innerText;
		this.props.updateTags(
			this.props.tags.filter(tag => tag.name !== tagName)
		);
	}

	private getOptionFromDb = (value: string) => {
		return this.props.options.find(option => option.name === value.toLowerCase());
	}
}
