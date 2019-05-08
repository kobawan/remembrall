import * as React from "react";
import { MutationFn } from "react-apollo";
import "./projectForm.less";
import { ProjectFields, CommonFields } from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { TextAreaRow, OnChangeFn, TextInputRowWithList, TextInputTitle } from "../Form/FormComponents";
import { logMutationErrors } from "../../utils/errorHandling";
import { CategoryWrapper, CategoryRenderProps } from "./CategoryWrapper";
import { ToolWrapper, ToolRenderProps } from "./ToolWrapper";
import { MaterialWrapper, MaterialRenderProps } from "./MaterialWrapper";

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
					<CategoryWrapper>
						{({ addCategory, categories: { data, error }}: CategoryRenderProps) => {
							if(error) {
								console.error(error);
							}
							logMutationErrors(addCategory);
							return (
								<TextInputRowWithList
									name={Fields.categories}
									tags={categories}
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
							if(error) {
								console.error(error);
							}
							logMutationErrors(addTool);
							return (
								<TextInputRowWithList
									name={Fields.tools}
									tags={tools}
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
							if(error) {
								console.error(error);
							}
							logMutationErrors(addMaterial);
							return (
								<TextInputRowWithList
									name={Fields.materials}
									tags={materials}
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
	 * Updates or creates project to db
	 */
	private submitProject = () => {
		/**
		 * @todo add or update project to graphql
		 */
		this.formHasChanges
			? this.props.updateTicket()
			: this.props.createTicket();
	}

	/**
	 * Checks if form contains changes
	 */
	private formHasChanges = () => {
		/**
		 * @todo implement logic
		 */
		return false;
	}
}