import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { CommonFields, CategoryFields } from "../../types";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { Form, FormSize } from "../Form/Form";
import { AddCategoryData, CategoryInput, UpdateCategoryData } from "../CategoryColumn/CategoryWrapper";

interface FormProps {
	ticket?: CategoryFields;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	createTicket: MutationFn<AddCategoryData, CategoryInput>;
	deleteTicket: (data: CommonFields) => void;
	updateTicket: MutationFn<UpdateCategoryData, CategoryInput & { id: string }>;
}

enum Fields {
	name = "name",
}

type FormState = Omit<CategoryFields, "id">;

export class CategoryForm extends React.Component<FormProps, FormState> {
	public state: FormState = {
		name: this.props.ticket ? this.props.ticket.name : "",
	};

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
				Content={null}
				safeCloseForm={safeCloseForm}
				submitForm={this.submitProject}
				size={FormSize.small}
			/>
		);
	}

	private renderTitle = () => (
		<FormTitle
			name={Fields.name}
			value={this.state.name}
			onChange={this.handleInput}
			placeholder="Category name"
		/>
	)

	private handleInput: OnChangeFn = (e) => {
		const { name, value } = e.currentTarget;

		this.setState({ [name]: value } as any);
	}

	/**
	 * Checks if inputs are valid and then updates or creates project to db
	 */
	private submitProject = () => {
		const { name } = this.state;

		if(!this.formIsValid()) {
			this.props.openInvalidPopup();
			return;
		}

		if(this.formHasChanges()) {
			const params = { name: name.toLowerCase() };

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
		const { name } = this.state;
		const ticket = this.props.ticket;

		if(ticket) {
			return name.toLowerCase() !== ticket.name;
		}

		return !!name.length;
	}

	/**
	 * Checks if all required fields have been filled in
	 */
	private formIsValid = () => {
		const { name } = this.state;

		return name.length > 0;
	}
}
