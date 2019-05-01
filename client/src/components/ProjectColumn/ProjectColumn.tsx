import * as React from "react";
import { Column } from "../Column/Column";
import { ColumnType, ProjectFields } from "../../types";
import { logMutationErrors } from "../../utils/errorHandling";
import { FormOverlay } from "../FormOverlay/FormOverlay";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, ProjectRenderProps } from "./ProjectWrapper";

interface ColumnState {
	formOpened: boolean;
	formHasChanges: () => boolean;
	formProps?: ProjectFields;
}

export class ProjectColumn extends React.PureComponent<{}, ColumnState> {
	public state: ColumnState = {
		formOpened: false,
		formHasChanges: () => false,
	};

	public render() {
		const { formOpened } = this.state;

		return (
			<ProjectWrapper>
				{({ addProject, deleteProject, updateProject, projects: { data, error }}: ProjectRenderProps) => {
					/**
					 * @todo handle loading?
					 */
					if(error) {
						console.error(error);
					}
					logMutationErrors(addProject, deleteProject, updateProject);

					return (<>
						<Column
							tickets={data && data.projects ? data.projects : []}
							type={ColumnType.Projects}
							updateTicket={updateProject.mutation}
							openForm={this.openForm}
						/>
						{formOpened && <>
							<FormOverlay closeForm={this.closeForm} />
							<ProjectForm
								ticket={this.state.formProps}
								closeForm={this.closeForm}
								setFormHasChangesFn={this.setFormHasChangesFn}
								createTicket={addProject.mutation}
								deleteTicket={deleteProject.mutation}
								updateTicket={updateProject.mutation}
							/>
						</>}
					</>);
				}}
			</ProjectWrapper>
		);
	}

	/**
	 * Allows checking for changes from the form to be able to safely close it
	 */
	private setFormHasChangesFn = (fn: () => boolean) => {
		this.setState({ formHasChanges: fn });
	}

	/**
	 * Passes ticket props to form on open
	 */
	private openForm = (props?: ProjectFields) => {
		this.setState({
			formOpened: true,
			formProps: props,
		});
	}

	/**
	 * Checks if form has changes, so it can close it.
	 */
	private closeForm = () => {
		if(!this.state.formHasChanges()) {
			this.setState({
				formOpened: false,
				formProps: undefined,
			});
		}
	}
}
