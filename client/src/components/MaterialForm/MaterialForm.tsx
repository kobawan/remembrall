import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { CommonFields, MaterialFields } from "../../types";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { Form } from "../Form/Form";
import { RowInput } from "../Form/RowInput";
import { AddMaterialData, MaterialInput, UpdateMaterialData } from "../MaterialColumn/MaterialWrapper";
import { getInitialState } from "../../utils/getInitialState";

interface FormProps {
	ticket?: MaterialFields;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	createTicket: MutationFn<AddMaterialData, MaterialInput>;
	deleteTicket: (data: CommonFields) => void;
	updateTicket: MutationFn<UpdateMaterialData, MaterialInput & { id: string }>;
}

enum Fields {
	name = "name",
	amount = "amount",
	color = "color",
}

type FormState = Omit<MaterialFields, "id">;

const defaultState: FormState = {
	name: "",
	amount: 1,
	color: null,
};

export class MaterialForm extends React.Component<FormProps, FormState> {
	public state: FormState = getInitialState(defaultState, this.props.ticket);

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
		<FormTitle
			name={Fields.name}
			value={this.state.name}
			onChange={this.handleInput}
			placeholder="Material name"
		/>
	)

	private renderContent = () => (
		<>
			<RowInput
				name={Fields.color}
				value={this.state.color || ""}
				onChange={this.handleInput}
			/>
			<RowInput
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
			color,
		} = this.state;

		if(!this.formIsValid()) {
			this.props.openInvalidPopup();
			return;
		}

		if(this.formHasChanges()) {
			const params = {
				name,
				amount,
				color,
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
			color,
		} = this.state;
		const ticket = this.props.ticket;

		if(ticket) {
			return (
				amount !== ticket.amount
				|| name !== ticket.name
				|| color !== ticket.color
			);
		}

		return (
			!!name.length
			|| amount !== 1
			|| !!color && !!color.length
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
