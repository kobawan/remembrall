import React from "react";
import { MutationFn } from "react-apollo";
import { CategoryWrapper, DeleteCategoryData } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";

interface CategoryColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteCategoryData, { id: string }>) => void;
}

export const CategoryColumn = React.memo(({ safeDeleteTicket }: CategoryColumnProps) => {
	return (
		<CategoryWrapper>
			{({ addCategory, updateCategory, deleteCategory, categories: { data, error }}) => {
				logErrors(error, addCategory, updateCategory, deleteCategory);

				return (
					<Column
						tickets={data && data.categories ? data.categories : []}
						type={ColumnType.Categories}
						updateTicket={updateCategory.mutation}
						createTicket={addCategory.mutation}
						deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteCategory.mutation)}
					/>
				);
			}}
		</CategoryWrapper>
	);
});
