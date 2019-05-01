import * as React from "react";
import { MutationFn } from "react-apollo";
import "./projectForm.less";
import { ProjectFields } from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { TextAreaRow, OnChangeFn, TextInputRowWithList, TextInputTitle } from "../Form/FormComponents";

interface FormProps {
	ticket?: ProjectFields;
	closeForm: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	createTicket: MutationFn<any, any>;
	deleteTicket: MutationFn<any, any>;
	updateTicket: MutationFn<any, any>;
}

type InputNames = Exclude<keyof ProjectFields, "id">;
type FormState = Required<Pick<ProjectFields, InputNames>>;

const defaultState: FormState = {
	name: "",
	categories: [],
	tools: [],
	materials: [],
	notes: "",
	instructions: "",
};

enum Fields {
	name = "name",
	categories = "categories",
	tools = "tools",
	materials = "materials",
	notes = "notes",
	instructions = "instructions",
}

export class ProjectForm extends React.Component<FormProps, FormState> {
	public state: FormState = getInitialState(defaultState, this.props.ticket);

	public componentDidMount() {
		this.props.setFormHasChangesFn(this.formHasChanges);
	}

	public render() {
		const { closeForm } = this.props;
		const {
			name,
			categories,
			tools,
			materials,
			notes,
			instructions,
		} = this.state;

		return (
			<div className="form">
				<TextInputTitle
					name={Fields.name}
					value={name}
					onChange={this.handleInput}
				/>
				<div className="content">
					<TextInputRowWithList
						name={Fields.categories}
						tags={categories}
						options={[]}
						addOption={() => {}}
						isRequired={true}
					/>
					<TextInputRowWithList
						name={Fields.tools}
						tags={tools}
						options={[]}
						addOption={() => {}}
						isRequired={true}
					/>
					<TextInputRowWithList
						name={Fields.materials}
						tags={materials}
						options={[]}
						addOption={() => {}}
						isRequired={true}
					/>
					<TextAreaRow
						name={Fields.instructions}
						value={instructions}
						onChange={this.handleInput}
					/>
					<TextAreaRow
						name={Fields.notes}
						value={notes}
						onChange={this.handleInput}
					/>
				</div>
				<div className="footer">
					<button onClick={closeForm}>Cancel</button>
					<button onClick={this.submitProject}>Save</button>
				</div>
			</div>
		);
	}

	private handleInput: OnChangeFn = (e) => {
		const { name, value } = e.target;

		this.setState({ [name]: value } as any);
	}

	private submitProject = () => {
		/**
		 * @todo add or update project to graphql
		 */
		this.formHasChanges
			? this.props.updateTicket()
			: this.props.createTicket();
	}

	private formHasChanges = () => {
		/**
		 * @todo implement logic
		 */
		return false;
	}
}