import React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { CategoryWrapper, DeleteCategoryData } from "./CategoryWrapper";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType, CategoryFields } from "../../types";
import { CategoryForm } from "../CategoryForm/CategoryForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";

interface CategoryColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteCategoryData, { id: string }>) => void;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	openForm: (type: ColumnType, props?: FormPropsType) => void;
	formOpened?: ColumnType;
	formProps?: CategoryFields;
	showTooltip: (props: BasicTicketTooltipProps) => void;
	closeTooltip: () => void;
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
			showTooltip,
			closeTooltip,
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
								displayFields={["name"]}
								displayDirection={DisplayDirection.row}
								showTooltip={showTooltip}
								closeTooltip={closeTooltip}
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
