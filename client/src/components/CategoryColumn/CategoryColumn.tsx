import * as React from "react";
import { MutationFn } from "react-apollo";
import { CategoryWrapper, CategoryRenderProps } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";

interface CategoryColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<any, any>) => void;
}

export class CategoryColumn extends React.Component<CategoryColumnProps> {
	public shouldComponentUpdate() {
		return false;
	}

	public render() {
		const { safeDeleteTicket } = this.props;
		return (
			<CategoryWrapper>
				{({ addCategory, updateCategory, deleteCategory, categories: { data, error }}: CategoryRenderProps) => {
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
	}
}
