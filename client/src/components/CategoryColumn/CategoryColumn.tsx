import React, { useContext } from "react";
import { MutationFn } from "react-apollo";
import { CategoryWrapper, DeleteCategoryData } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface CategoryColumnProps {
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteCategoryData, { id: string }>) => void;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
}

export const CategoryColumn: React.FC<CategoryColumnProps> = ({
  safeDeleteTicket,
  closeForm,
  openInvalidPopup,
  openChangesPopup,
}) => {
  const { formOpened, formProps } = useContext(ReducerContext).state.formState;

  return (
    <CategoryWrapper>
      {({ addCategory, updateCategory, deleteCategory, categories: { data, error }}) => {
        logErrors(error, addCategory, updateCategory, deleteCategory);

        return (
          <>
            <Column
              tickets={data && data.categories ? data.categories : []}
              type={ColumnType.Categories}
              updateTicket={updateCategory.mutation}
              deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteCategory.mutation)}
              displayFields={["name"]}
              displayDirection={DisplayDirection.row}
            />
            {formOpened === ColumnType.Categories && (
              <CategoryForm
                ticket={formProps}
                closeForm={closeForm}
                openInvalidPopup={openInvalidPopup}
                openChangesPopup={openChangesPopup}
                createTicket={addCategory.mutation}
                deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteCategory.mutation)}
                updateTicket={updateCategory.mutation}
              />
            )}
          </>
        );
      }}
    </CategoryWrapper>
  );
};
