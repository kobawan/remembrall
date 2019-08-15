import React, { useContext } from "react";
import { MutationFn } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, MaterialFields } from "../../types";
import { MaterialWrapper, DeleteMaterialData } from "./MaterialWrapper";
import { MaterialForm } from "../MaterialForm/MaterialForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface MaterialColumnProps {
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteMaterialData, { id: string }>) => void;
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

  return (
    <MaterialWrapper>
      {({ addMaterial, updateMaterial, deleteMaterial, materials: { data, error }}) => {
        logErrors(error, addMaterial, updateMaterial, deleteMaterial);

        return (
          <>
            <Column
              tickets={data && data.materials ? data.materials : []}
              type={ColumnType.Materials}
              updateTicket={updateMaterial.mutation}
              deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteMaterial.mutation)}
              displayFields={["name", "color", "amount"]}
              displayDirection={DisplayDirection.row}
            />
            {formOpened === ColumnType.Materials && (
              <MaterialForm
                ticket={formProps as MaterialFields}
                closeForm={closeForm}
                openInvalidPopup={openInvalidPopup}
                openChangesPopup={openChangesPopup}
                createTicket={addMaterial.mutation}
                deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteMaterial.mutation)}
                updateTicket={updateMaterial.mutation}
              />
            )}
          </>
        );
      }}
    </MaterialWrapper>
  );
};
