import React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { CategoryWrapper, DeleteCategoryData } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType } from "../../types";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { FormManagerProps } from "../ColumnsManager/types";

interface CategoryColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteCategoryData, { id: string }>) => void;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	openForm: (props: FormManagerProps) => void;
	formOpened?: ColumnType;
	formProps?: FormPropsType;
}

export class CategoryColumn extends React.Component<CategoryColumnProps> {
	public shouldComponentUpdate(nextProps: CategoryColumnProps) {
		return (
			!isEqual(this.props.formProps, nextProps.formProps)
			|| this.props.formOpened !== nextProps.formOpened
		);
	}

	public render() {
		const {
			safeDeleteTicket,
			openForm,
			formOpened,
			formProps,
			closeForm,
			openInvalidPopup,
			openChangesPopup,
		} = this.props;
		return (
			<CategoryWrapper>
				{({ addCategory, updateCategory, deleteCategory, categories: { data, error }}) => {
					logErrors(error, addCategory, updateCategory, deleteCategory);
					const openCategoryForm = (formProps?: FormPropsType) => {
						openForm({ formOpened: ColumnType.Categories, formProps });
					};

					return (
						<>
							<Column
								tickets={data && data.categories ? data.categories : []}
								type={ColumnType.Categories}
								updateTicket={updateCategory.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteCategory.mutation)}
								openForm={openCategoryForm}
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
	}
}
