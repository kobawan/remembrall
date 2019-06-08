import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, TicketData, CommonFields } from "../../types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";

interface ColumnProps {
	type: ColumnType;
	tickets: TicketData[];
	openForm: (props?: TicketData) => void;
	updateTicket: MutationFn<any, any>;
	deleteTicket: (data: CommonFields) => void;
}

export class Column extends React.Component<ColumnProps> {
	public render() {
		const { type, openForm } = this.props;

		return (
			<div className="column">
				<ColumnHeader type={type} openForm={openForm} />
				<div className="content">
					{this.renderTickets()}
				</div>
			</div>
		);
	}

	private renderTickets = () => {
		const { tickets, type, updateTicket, openForm, deleteTicket } = this.props;
		return tickets.map((data, index) => (
			<Ticket
				data={data}
				key={index}
				type={type}
				openForm={openForm}
				updateTicket={updateTicket}
				deleteTicket={deleteTicket}
			/>
		));
	}
}
