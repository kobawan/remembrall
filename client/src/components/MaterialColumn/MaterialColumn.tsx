import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, MaterialFields } from "../../types";
import { DeleteMaterialData, useMaterialQueryAndMutations } from "./MaterialWrapper";
import { MaterialForm } from "../MaterialForm/MaterialForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface MaterialColumnProps {
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFunction<DeleteMaterialData, { id: string }>) => void;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
}

export const MaterialColumn: React.FC<MaterialColumnProps> = ({
  safeDeleteTicket,
  closeForm,
  openChangesPopup,
  openInvalidPopup,
}) => {
  const { formOpened, formProps } = useContext(ReducerContext).state.formState;
  const [
    { data, error, loading },
    [addMaterial, addRes],
    [updateMaterial, updateRes],
    [deleteMaterial, deleteRes],
  ] = useMaterialQueryAndMutations();

  logErrors(error, addRes.error, updateRes.error, deleteRes.error);
  // @todo handle loading
  const isLoading = loading || addRes.loading || updateRes.loading || deleteRes.loading;

  const deleteTicket = (data: CommonFields) => safeDeleteTicket(data, deleteMaterial);

  return (
    <>
      <Column
        tickets={data && data.materials ? data.materials : []}
        type={ColumnType.Materials}
        updateTicket={updateMaterial}
        deleteTicket={deleteTicket}
        displayFields={["name", "color", "amount"]}
        displayDirection={DisplayDirection.row}
        isLoading={isLoading}
      />
      {formOpened === ColumnType.Materials && (
        <MaterialForm
          ticket={formProps as MaterialFields}
          closeForm={closeForm}
          openInvalidPopup={openInvalidPopup}
          openChangesPopup={openChangesPopup}
          createTicket={addMaterial}
          deleteTicket={deleteTicket}
          updateTicket={updateMaterial}
        />
      )}
    </>
  );
};
