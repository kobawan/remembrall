import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, MaterialFields } from "../../types";
import { DeleteMaterialData, useMaterialQueryAndMutations } from "./MaterialWrapper";
import { MaterialForm } from "../MaterialForm/MaterialForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";
import { getFilteredItems } from "../../utils/getFilteredItems";

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
  const {
    state: {
      filterTooltipState: { activeFilters },
      formState: { formOpened, formProps }
    },
  } = useContext(ReducerContext);
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

  const materials = data && data.materials
    ? getFilteredItems({ activeFilters, items: data.materials })
    : [];

  return (
    <>
      <Column
        tickets={materials}
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
