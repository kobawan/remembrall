import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, FormPropsType, ToolFields } from "../../types";
import { ToolWrapper, DeleteToolData } from "./ToolWrapper";
import { ToolForm } from "../ToolForm/ToolForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";
import { FormManagerProps } from "../ColumnsManager/types";

interface ToolColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteToolData, { id: string }>) => void;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	openForm: (props: FormManagerProps) => void;
	formOpened?: ColumnType;
	formProps?: FormPropsType;
	showTooltip: (props: BasicTicketTooltipProps) => void;
	closeTooltip: () => void;
}

export class ToolColumn extends React.Component<ToolColumnProps> {
	public shouldComponentUpdate(nextProps: ToolColumnProps) {
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
			<ToolWrapper>
				{({ addTool, updateTool, deleteTool, tools: { data, error }}) => {
					logErrors(error, addTool, updateTool, deleteTool);

					const openToolForm = (formProps?: FormPropsType) => {
						openForm({ formOpened: ColumnType.Tools, formProps });
					};

					return (
						<>
							<Column
								tickets={data && data.tools ? data.tools : []}
								type={ColumnType.Tools}
								updateTicket={updateTool.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteTool.mutation)}
								openForm={openToolForm}
								displayFields={["name", "type", "size", "amount"]}
								displayDirection={DisplayDirection.row}
								showTooltip={showTooltip}
								closeTooltip={closeTooltip}
							/>
							{formOpened === ColumnType.Tools && (
								<ToolForm
									ticket={formProps as ToolFields}
									closeForm={closeForm}
									openInvalidPopup={openInvalidPopup}
									openChangesPopup={openChangesPopup}
									createTicket={addTool.mutation}
									deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteTool.mutation)}
									updateTicket={updateTool.mutation}
								/>
							)}
						</>
					);
				}}
			</ToolWrapper>
		);
	}
}
