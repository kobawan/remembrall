import React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, MaterialFields, FormPropsType } from "../../types";
import { MaterialWrapper, DeleteMaterialData } from "./MaterialWrapper";
import { MaterialForm } from "../MaterialForm/MaterialForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";

interface MaterialColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteMaterialData, { id: string }>) => void;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	openForm: (type: ColumnType, props?: FormPropsType) => void;
	formOpened?: ColumnType;
	formProps?: MaterialFields;
}

export class MaterialColumn extends React.Component<MaterialColumnProps> {
	public shouldComponentUpdate(nextProps: MaterialColumnProps) {
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
								openForm={(props?: FormPropsType) => openForm(ColumnType.Materials, props)}
								displayFields={["name", "color", "amount"]}
								displayDirection={DisplayDirection.row}
							/>
							{formOpened === ColumnType.Materials && (
								<MaterialForm
									ticket={formProps}
									closeForm={closeForm}
									safeCloseForm={safeCloseForm}
									openInvalidPopup={openInvalidPopup}
									setFormHasChangesFn={setFormHasChangesFn}
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
	}
}
