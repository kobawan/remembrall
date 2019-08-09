import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { ToolFields, CommonFields } from "../../types";
import { AddToolData, UpdateToolData, ToolInput } from "../ToolColumn/ToolWrapper";
import { OnChangeFn } from "../Form/types";
import { TextInputTitle } from "../Form/TextInputTitle";
import { Form } from "../Form/Form";
import { TextInputRow } from "../Form/TextInputRow";
import { InputRowWithUnit } from "../Form/InputRowWithUnit";

interface FormProps {
	ticket?: ToolFields;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	createTicket: MutationFn<AddToolData, ToolInput>;
	deleteTicket: (data: CommonFields) => void;
	updateTicket: MutationFn<UpdateToolData, ToolInput & { id: string }>;
}

enum Fields {
	name = "name",
	amount = "amount",
	type = "type",
	size = "size",
	measurement = "measurement",
}

enum Measurements {
	mm = "mm",
	us = "us",
	uk = "uk",
}

type FormState = Required<Omit<ToolFields, "id"> & { measurement: Measurements }>;

const defaultState: FormState = {
	name: "",
	amount: 1,
	type: "",
	size: "",
	measurement: Measurements.mm,
};

const getToolDefaultState = (defaultState: FormState, ticket?: ToolFields) => {
	if(!ticket) {
		return defaultState;
	}
	const { name, amount, type, size = "" } = ticket;
	const [
		,
		value = "",
		measurement = Measurements.mm,
	] = size.match(/([\d+\.|\,\d*]+)([a-z]+)/) || [];
	return {
		name,
		amount: amount || 1,
		type: type || "",
		size: value,
		measurement: measurement as Measurements,
	};
};

export class ToolForm extends React.Component<FormProps, FormState> {
	public state: FormState = getToolDefaultState(defaultState, this.props.ticket);

	public shouldComponentUpdate(nextProps: FormProps, nextState: FormState) {
		return !isEqual(this.props.ticket, nextProps.ticket) || !isEqual(this.state, nextState);
	}

	public componentDidMount() {
		this.props.setFormHasChangesFn(this.formHasChanges);
	}

	public render() {
		const { safeCloseForm } = this.props;

		return(
			<Form
				Title={this.renderTitle()}
				Content={this.renderContent()}
				safeCloseForm={safeCloseForm}
				submitForm={this.submitProject}
			/>
		);
	}

	private renderTitle = () => (
		<TextInputTitle
			name={Fields.name}
			value={this.state.name}
			onChange={this.handleInput}
			placeholder="Tool name"
		/>
	)

	private renderContent = () => (
		<>
			<TextInputRow
				name={Fields.type}
				value={`${this.state.type}`}
				onChange={this.handleInput}
			/>
			<InputRowWithUnit
				name={Fields.size}
				value={`${this.state.size}`}
				unitValue={this.state.measurement}
				onChange={this.handleInput}
				type="number"
				options={Object.keys(Measurements)}
			/>
			<TextInputRow
				name={Fields.amount}
				value={`${this.state.amount}`}
				type="number"
				onChange={this.handleNumberInput}
			/>
		</>
	)

	private handleNumberInput: OnChangeFn = (e) => {
		const { value } = e.currentTarget;

		this.setState({ amount: +value });
	}

	private handleInput: OnChangeFn = (e) => {
		const { name, value } = e.currentTarget;

		this.setState({ [name]: value } as any);
	}

	/**
	 * Checks if inputs are valid and then updates or creates project to db
	 */
	private submitProject = () => {
		const {
			name,
			amount,
			size,
			type,
			measurement,
		} = this.state;

		if(!this.formIsValid()) {
			this.props.openInvalidPopup();
			return;
		}

		if(this.formHasChanges()) {
			const params = {
				name,
				amount,
				size: `${size}${measurement}`,
				type,
			};

			if(this.props.ticket) {
				this.props.updateTicket({
					variables: {
						params,
						id: this.props.ticket.id,
					},
				});
			} else {
				this.props.createTicket({ variables: { params } });
			}
		}

		this.props.closeForm();
	}

	/**
	 * Checks if form contains changes
	 */
	private formHasChanges = () => {
		const {
			amount,
			name,
			size,
			type,
			measurement,
		} = this.state;
		const ticket = this.props.ticket;

		if(ticket) {
			return (
				amount !== ticket.amount
				|| name !== ticket.name
				|| `${size}${measurement}` !== ticket.size
				|| type !== ticket.type
			);
		}

		return (
			!!name.length
			|| amount >= 0
			|| !!size.length
			|| !!type.length
			|| measurement !== Measurements.mm
		);
	}

	/**
	 * Checks if all required fields have been filled in
	 */
	private formIsValid = () => {
		const { name } = this.state;

		return name.length > 0;
	}
}
