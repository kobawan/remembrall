import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, TicketData, CommonFields, FormPropsType } from "../../types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";
import { DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";

interface ColumnProps {
	type: ColumnType;
	tickets: TicketData[];
	displayFields: string[];
	openForm: (props?: FormPropsType) => void;
	updateTicket: MutationFn<any, { id: string, params: any }>;
	deleteTicket: (data: CommonFields) => void;
	displayDirection: DisplayDirection;
	showTooltip: (props: BasicTicketTooltipProps) => void;
	closeTooltip: () => void;
}

export class Column extends React.Component<ColumnProps> {
	public render() {
		const { type, openForm } = this.props;

		return (
			<div className="column">
				<ColumnHeader type={type} openEditor={openForm} />
				<div className="content">
					{this.renderTickets()}
				</div>
			</div>
		);
	}

	/**
	 * Shows all tickets from db
	 */
	private renderTickets = () => {
		const {
			tickets,
			type,
			updateTicket,
			openForm,
			deleteTicket,
			displayFields,
			displayDirection,
			showTooltip,
			closeTooltip,
		} = this.props;
		return tickets.map((data, index) => (
			<Ticket
				data={data}
				key={index}
				type={type}
				focused={false}
				openForm={openForm}
				updateTicket={updateTicket}
				deleteTicket={deleteTicket}
				displayFields={displayFields}
				displayDirection={displayDirection}
				showTooltip={showTooltip}
				closeTooltip={closeTooltip}
			/>
		));
	}
}
