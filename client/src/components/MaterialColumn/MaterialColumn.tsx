import React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType, MaterialFields } from "../../types";
import { MaterialWrapper, DeleteMaterialData } from "./MaterialWrapper";
import { MaterialForm } from "../MaterialForm/MaterialForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";
import { FormManagerProps } from "../ColumnsManager/types";

interface MaterialColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteMaterialData, { id: string }>) => void;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	openForm: (props: FormManagerProps) => void;
	formOpened?: ColumnType;
	formProps?: FormPropsType;
	showTooltip: (props: BasicTicketTooltipProps) => void;
	closeTooltip: () => void;
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
			openChangesPopup,
			openInvalidPopup,
			showTooltip,
			closeTooltip,
		} = this.props;

		return (
			<MaterialWrapper>
				{({ addMaterial, updateMaterial, deleteMaterial, materials: { data, error }}) => {
					logErrors(error, addMaterial, updateMaterial, deleteMaterial);

					const openMaterialForm = (formProps?: FormPropsType) => {
						openForm({ formOpened: ColumnType.Materials, formProps });
					};

					return (
						<>
							<Column
								tickets={data && data.materials ? data.materials : []}
								type={ColumnType.Materials}
								updateTicket={updateMaterial.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteMaterial.mutation)}
								openForm={openMaterialForm}
								displayFields={["name", "color", "amount"]}
								displayDirection={DisplayDirection.row}
								showTooltip={showTooltip}
								closeTooltip={closeTooltip}
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
	}
}
