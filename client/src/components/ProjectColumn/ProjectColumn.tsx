import React, { useContext } from "react";
import { MutationFn } from "react-apollo";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, DeleteProjectData } from "./ProjectWrapper";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface ProjectColumnProps {
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteProjectData, { id: string }>) => void;
}

export const ProjectColumn: React.FC<ProjectColumnProps> = ({
	safeDeleteTicket,
	closeForm,
	openChangesPopup,
	openInvalidPopup,
}) => {
	const { formOpened, formProps } = useContext(ReducerContext).state.formState;

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
};
