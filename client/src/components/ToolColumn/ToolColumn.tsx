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

interface ToolColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteToolData, { id: string }>) => void;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	openForm: (type: ColumnType, props?: FormPropsType) => void;
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
			setFormHasChangesFn,
			safeCloseForm,
			openInvalidPopup,
			showTooltip,
			closeTooltip,
		} = this.props;

		return (
			<ToolWrapper>
				{({ addTool, updateTool, deleteTool, tools: { data, error }}) => {
					logErrors(error, addTool, updateTool, deleteTool);

					return (
						<>
							<Column
								tickets={data && data.tools ? data.tools : []}
								type={ColumnType.Tools}
								updateTicket={updateTool.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteTool.mutation)}
								openForm={(props?: FormPropsType) => openForm(ColumnType.Tools, props)}
								displayFields={["name", "type", "size", "amount"]}
								displayDirection={DisplayDirection.row}
								showTooltip={showTooltip}
								closeTooltip={closeTooltip}
							/>
							{formOpened === ColumnType.Tools && (
								<ToolForm
									ticket={formProps as ToolFields}
									closeForm={closeForm}
									safeCloseForm={safeCloseForm}
									openInvalidPopup={openInvalidPopup}
									setFormHasChangesFn={setFormHasChangesFn}
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
