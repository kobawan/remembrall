import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, ToolFields } from "../../types";
import { DeleteToolData, useToolQueryAndMutations } from "./ToolWrapper";
import { ToolForm } from "../ToolForm/ToolForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface ToolColumnProps {
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFunction<DeleteToolData, { id: string }>) => void;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
}

export const ToolColumn: React.FC<ToolColumnProps> = ({
  safeDeleteTicket,
  closeForm,
  openChangesPopup,
  openInvalidPopup,
}) => {
  const { formOpened, formProps } = useContext(ReducerContext).state.formState;
  const [
    { data, error, loading },
    [addTool, addRes],
    [updateTool, updateRes],
    [deleteTool, deleteRes],
  ] = useToolQueryAndMutations();

  logErrors(error, addRes.error, updateRes.error, deleteRes.error);
  // @todo handle loading
  const isLoading = loading || addRes.loading || updateRes.loading || deleteRes.loading;

  const deleteTicket = (data: CommonFields) => safeDeleteTicket(data, deleteTool);

  return (
    <>
      <Column
        tickets={data && data.tools ? data.tools : []}
        type={ColumnType.Tools}
        updateTicket={updateTool}
        deleteTicket={deleteTicket}
        displayFields={["name", "type", "size", "amount"]}
        displayDirection={DisplayDirection.row}
        isLoading={isLoading}
      />
      {formOpened === ColumnType.Tools && (
        <ToolForm
          ticket={formProps as ToolFields}
          closeForm={closeForm}
          openInvalidPopup={openInvalidPopup}
          openChangesPopup={openChangesPopup}
          createTicket={addTool}
          deleteTicket={deleteTicket}
          updateTicket={updateTool}
        />
      )}
    </>
  );
};
