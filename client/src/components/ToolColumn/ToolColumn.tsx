import * as React from "react";
import { MutationFn } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { ToolWrapper, DeleteToolData } from "./ToolWrapper";

interface ToolColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteToolData, { id: string }>) => void;
}

export class ToolColumn extends React.Component<ToolColumnProps> {
	public shouldComponentUpdate() {
		return false;
	}

	public render() {
		const { safeDeleteTicket } = this.props;
		return (
			<ToolWrapper>
				{({ addTool, updateTool, deleteTool, tools: { data, error }}) => {
					logErrors(error, addTool, updateTool, deleteTool);

					return (
						<Column
							tickets={data && data.tools ? data.tools : []}
							type={ColumnType.Tools}
							updateTicket={updateTool.mutation}
							createTicket={addTool.mutation}
							deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteTool.mutation)}
						/>
					);
				}}
			</ToolWrapper>
		);
	}
}
