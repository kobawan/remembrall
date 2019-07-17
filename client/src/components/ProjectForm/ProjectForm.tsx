import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { ProjectFields, CommonFields } from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { TextInputRowWithList } from "../Form/TextInputRowWithList";
import { logErrors } from "../../utils/errorHandling";
import { CategoryWrapper, CategoryRenderProps } from "../CategoryColumn/CategoryWrapper";
import { ToolWrapper, ToolRenderProps } from "../ToolColumn/ToolWrapper";
import { MaterialWrapper, MaterialRenderProps } from "../MaterialColumn/MaterialWrapper";
import { OnChangeFn } from "../Form/types";
import { TextInputTitle } from "../Form/TextInputTitle";
import { TextAreaRow } from "../Form/TextAreaRow";
import { UpdateProjectData, AddProjectData, ProjectInput } from "../ProjectColumn/ProjectWrapper";
import { Form } from "../Form/Form";

interface FormProps {
	ticket?: ProjectFields;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	createTicket: MutationFn<AddProjectData, ProjectInput>;
	deleteTicket: (data: CommonFields) => void;
	updateTicket: MutationFn<UpdateProjectData, ProjectInput & { id: string }>;
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
		/>
	)

	private renderContent = () => (
		<>
			<CategoryWrapper>
				{({ addCategory, categories: { data, error }}: CategoryRenderProps) => {
					logErrors(error, addCategory);
					return (
						<TextInputRowWithList
							name={Fields.categories}
							tags={this.state.categories}
							options={data && data.categories ? data.categories : []}
							addOption={addCategory.mutation}
							isRequired={true}
							updateTags={this.updateCategoryTags}
						/>
					);
				}}
			</CategoryWrapper>
			<ToolWrapper>
				{({ addTool, tools: { data, error }}: ToolRenderProps) => {
					logErrors(error, addTool);
					return (
						<TextInputRowWithList
							name={Fields.tools}
							tags={this.state.tools}
							options={data && data.tools ? data.tools : []}
							addOption={addTool.mutation}
							isRequired={true}
							updateTags={this.updateToolTags}
						/>
					);
				}}
			</ToolWrapper>
			<MaterialWrapper>
				{({ addMaterial, materials: { data, error }}: MaterialRenderProps) => {
					logErrors(error, addMaterial);
					return (
						<TextInputRowWithList
							name={Fields.materials}
							tags={this.state.materials}
							options={data && data.materials ? data.materials : []}
							addOption={addMaterial.mutation}
							isRequired={true}
							updateTags={this.updateMaterialTags}
						/>
					);
				}}
			</MaterialWrapper>
			<TextAreaRow
				name={Fields.instructions}
				value={this.state.instructions}
				onChange={this.handleInput}
			/>
			<TextAreaRow
				name={Fields.notes}
				value={this.state.notes}
				onChange={this.handleInput}
			/>
		</>
	)

	/**
	 * Handles simple inputs
	 */
	private handleInput: OnChangeFn = (e) => {
		const { name, value } = e.currentTarget;

		this.setState({ [name]: value } as any);
	}

	private updateCategoryTags = (tags: CommonFields[]) => {
		this.setState({ categories: tags });
	}

	private updateToolTags = (tags: CommonFields[]) => {
		this.setState({ tools: tags });
	}

	private updateMaterialTags = (tags: CommonFields[]) => {
		this.setState({ materials: tags });
	}

	/**
	 * Checks if inputs are valid and then updates or creates project to db
	 */
	private submitProject = () => {
		const {
			categories,
			materials,
			tools,
			name,
			instructions,
			notes,
		} = this.state;

		if(!this.formIsValid()) {
			this.props.openInvalidPopup();
			return;
		}

		if(this.formHasChanges()) {
			const params = {
				name,
				instructions,
				notes,
				categories: categories.map(tag => tag.id),
				materials: materials.map(tag => tag.id),
				tools: tools.map(tag => tag.id),
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
			instructions,
			notes,
			categories,
			materials,
			tools,
			name,
		} = this.state;
		const ticket = this.props.ticket;

		if(ticket) {
			return (
				instructions !== ticket.instructions
				|| notes !== ticket.notes
				|| name !== ticket.name
				|| !isEqual(categories, ticket.categories)
				|| !isEqual(tools, ticket.tools)
				|| !isEqual(materials, ticket.materials)
			);
		}

		return (
			!!instructions.length
			|| !!notes.length
			|| !!name.length
			|| !!categories.length
			|| !!materials.length
			|| !!tools.length
		);
	}

	/**
	 * Checks if all required fields have been filled in
	 */
	private formIsValid = () => {
		const {
			categories,
			materials,
			tools,
			name,
		} = this.state;

		return (
			categories.length > 0
			&& materials.length > 0
			&& tools.length > 0
			&& name.length > 0
		);
	}
}