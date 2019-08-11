import React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { CategoryWrapper, DeleteCategoryData } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType, CategoryFields } from "../../types";
import { CategoryForm } from "../CategoryForm/CategoryForm";

interface CategoryColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteCategoryData, { id: string }>) => void;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	openForm: (type: ColumnType, props?: FormPropsType) => void;
	formOpened?: ColumnType;
	formProps?: CategoryFields;
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
			setFormHasChangesFn,
			safeCloseForm,
			openInvalidPopup,
		} = this.props;
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
								openForm={(props?: FormPropsType) => openForm(ColumnType.Categories, props)}
							/>
							{formOpened === ColumnType.Categories && (
								<CategoryForm
									ticket={formProps}
									closeForm={closeForm}
									safeCloseForm={safeCloseForm}
									openInvalidPopup={openInvalidPopup}
									setFormHasChangesFn={setFormHasChangesFn}
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
