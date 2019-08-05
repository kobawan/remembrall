import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, TicketData } from "../../types";
import { ToolWrapper, DeleteToolData } from "./ToolWrapper";
import { ToolForm } from "../ToolForm/ToolForm";

interface ToolColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteToolData, { id: string }>) => void;
	closeForm: () => void;
	safeCloseForm: () => void;
	openInvalidPopup: () => void;
	setFormHasChangesFn: (fn: () => boolean) => void;
	openForm: (type: ColumnType, props?: TicketData) => void;
	formOpened?: ColumnType;
	formProps?: TicketData;
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
								createTicket={addTool.mutation}
								deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteTool.mutation)}
								openForm={(props?: TicketData) => openForm(ColumnType.Tools, props)}
							/>
							{formOpened === ColumnType.Tools && (
								<ToolForm
									ticket={formProps}
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
