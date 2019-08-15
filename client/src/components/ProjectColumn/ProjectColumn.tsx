import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { ProjectForm, displayedFields } from "../ProjectForm/ProjectForm";
import { useProjectQueryAndMutations, DeleteProjectData } from "./ProjectWrapper";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface ProjectColumnProps {
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFunction<DeleteProjectData, { id: string }>) => void;
}

export const ProjectColumn: React.FC<ProjectColumnProps> = ({
  safeDeleteTicket,
  closeForm,
  openChangesPopup,
  openInvalidPopup,
}) => {
  const { formOpened, formProps } = useContext(ReducerContext).state.formState;
  const [
    { data, error, loading },
    [addProject, addRes],
    [updateProject, updateRes],
    [deleteProject, deleteRes],
  ] = useProjectQueryAndMutations();

  logErrors(error, addRes.error, updateRes.error, deleteRes.error);
  // @todo handle loading
  const isLoading = loading || addRes.loading || updateRes.loading || deleteRes.loading;

  const deleteTicket = (data: CommonFields) => safeDeleteTicket(data, deleteProject);

  return (
    <>
      <Column
        tickets={data && data.projects ? data.projects : []}
        type={ColumnType.Projects}
        updateTicket={updateProject}
        deleteTicket={deleteTicket}
        displayFields={displayedFields}
        displayDirection={DisplayDirection.column}
        isLoading={isLoading}
      />
      {formOpened === ColumnType.Projects && (
        <ProjectForm
          ticket={formProps}
          closeForm={closeForm}
          openInvalidPopup={openInvalidPopup}
          openChangesPopup={openChangesPopup}
          createTicket={addProject}
          deleteTicket={deleteTicket}
          updateTicket={updateProject}
        />
      )}
    </>
  );
};
