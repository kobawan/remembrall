import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, TicketData } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, DeleteProjectData } from "./ProjectWrapper";

interface ProjectColumnProps {
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	openForm: (type: ColumnType, props?: TicketData) => void;
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteProjectData, { id: string }>) => void;
	formOpened?: ColumnType;
	formProps?: TicketData;
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
			setFormHasChangesFn,
			safeCloseForm,
			openInvalidPopup,
		} = this.props;

		return (
			<ProjectWrapper>
				{({ addProject, deleteProject, updateProject, projects: { data, error }}) => {
					/**
					 * @todo handle loading?
					 */
					logErrors(error, addProject, deleteProject, updateProject);

					return (
						<>
							<Column
								tickets={data && data.projects ? data.projects : []}
								type={ColumnType.Projects}
								updateTicket={updateProject.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteProject.mutation)}
								createTicket={addProject.mutation}
								openForm={(props?: TicketData) => openForm(ColumnType.Projects, props)}
							/>
							{formOpened === ColumnType.Projects && (
								<ProjectForm
									ticket={formProps}
									closeForm={closeForm}
									safeCloseForm={safeCloseForm}
									openInvalidPopup={openInvalidPopup}
									setFormHasChangesFn={setFormHasChangesFn}
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
