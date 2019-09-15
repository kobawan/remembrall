import React, { useContext } from "react";
import { MutationFunction } from "react-apollo";
import { DeleteCategoryData, useCategoryQueryAndMutations } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, CategoryFields } from "../../types";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";
import { getFilteredItems } from "../../utils/getFilteredItems";

interface CategoryColumnProps {
  safeDeleteTicket: (data: CommonFields, deleteFn: MutationFunction<DeleteCategoryData, { id: string }>) => void;
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
  const {
    state: {
      filterTooltipState: { activeFilters },
      formState: { formOpened, formProps }
    },
  } = useContext(ReducerContext);
  const [
    { data, error, loading },
    [addCategory, addRes],
    [updateCategory, updateRes],
    [deleteCategory, deleteRes],
  ] = useCategoryQueryAndMutations();

  logErrors(error, addRes.error, updateRes.error, deleteRes.error);
  // @todo handle loading
  const isLoading = loading || addRes.loading || updateRes.loading || deleteRes.loading;

  const deleteTicket = (data: CommonFields) => safeDeleteTicket(data, deleteCategory);

  const categories = data && data.categories
    ? getFilteredItems({ activeFilters, items: data.categories })
    : [];

  return (
    <>
      <Column
        tickets={categories}
        type={ColumnType.Categories}
        updateTicket={updateCategory}
        deleteTicket={deleteTicket}
        displayFields={["name"]}
        displayDirection={DisplayDirection.row}
        isLoading={isLoading}
      />
      {formOpened === ColumnType.Categories && (
        <CategoryForm
          ticket={formProps as CategoryFields}
          closeForm={closeForm}
          openInvalidPopup={openInvalidPopup}
          openChangesPopup={openChangesPopup}
          createTicket={addCategory}
          deleteTicket={deleteTicket}
          updateTicket={updateCategory}
        />
      )}
    </>
  );
};
