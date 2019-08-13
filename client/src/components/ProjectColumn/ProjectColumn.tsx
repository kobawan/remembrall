import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, DeleteProjectData } from "./ProjectWrapper";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { FormManagerProps } from "../ColumnsManager/types";

interface ProjectColumnProps {
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	openForm: (props: FormManagerProps) => void;
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteProjectData, { id: string }>) => void;
	formOpened?: ColumnType;
	formProps?: FormPropsType;
}

export class ProjectColumn extends React.Component<ProjectColumnProps> {
	public shouldComponentUpdate(nextProps: ProjectColumnProps) {
		return (
			!isEqual(this.props.formProps, nextProps.formProps)
			|| this.props.formOpened !== nextProps.formOpened
		);
	}

	public render() {
		const {
			safeDeleteTicket,
			openForm,
			formOpened,
			formProps,
			closeForm,
			openChangesPopup,
			openInvalidPopup,
		} = this.props;

		return (
			<ProjectWrapper>
				{({ addProject, deleteProject, updateProject, projects: { data, error }}) => {
					/**
					 * @todo handle loading?
					 */
					logErrors(error, addProject, deleteProject, updateProject);

					const openProjectForm = (formProps?: FormPropsType) => {
						openForm({ formOpened: ColumnType.Projects, formProps });
					};

					return (
						<>
							<Column
								tickets={data && data.projects ? data.projects : []}
								type={ColumnType.Projects}
								updateTicket={updateProject.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteProject.mutation)}
								openForm={openProjectForm}
								displayFields={["name", "categories", "tools", "materials"]}
								displayDirection={DisplayDirection.column}
							/>
							{formOpened === ColumnType.Projects && (
								<ProjectForm
									ticket={formProps}
									closeForm={closeForm}
									openInvalidPopup={openInvalidPopup}
									openChangesPopup={openChangesPopup}
									createTicket={addProject.mutation}
									deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteProject.mutation)}
									updateTicket={updateProject.mutation}
								/>
							)}
						</>
					);
				}}
			</ProjectWrapper>
		);
	}
}
