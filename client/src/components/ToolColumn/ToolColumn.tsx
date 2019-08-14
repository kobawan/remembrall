import React, { useContext } from "react";
import { MutationFn } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields, ToolFields } from "../../types";
import { ToolWrapper, DeleteToolData } from "./ToolWrapper";
import { ToolForm } from "../ToolForm/ToolForm";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { ReducerContext } from "../ColumnsManager/context";

interface ToolColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteToolData, { id: string }>) => void;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
}

export const ToolColumn: React.FC<ToolColumnProps> = ({
	safeDeleteTicket,
	closeForm,
	openChangesPopup,
	openInvalidPopup,
}) => {
	const { formOpened, formProps } = useContext(ReducerContext).state.formState;

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
							displayFields={["name", "type", "size", "amount"]}
							displayDirection={DisplayDirection.row}
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
};
