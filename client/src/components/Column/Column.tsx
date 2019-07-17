import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, TicketData, CommonFields } from "../../types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";

interface ColumnProps {
	type: ColumnType;
	tickets: TicketData[];
	openForm?: (props?: TicketData) => void;
	updateTicket: MutationFn<any, { id: string, params: any }>;
	createTicket: MutationFn<any, { params: any }>;
	deleteTicket: (data: CommonFields) => void;
}

interface ColumnState {
	showNewTicket: boolean;
}

export class Column extends React.Component<ColumnProps, ColumnState> {
	public state: ColumnState = {
		showNewTicket: false,
	};

	public render() {
		const { type, openForm } = this.props;
		const { showNewTicket } = this.state;

		return (
			<div className="column">
				<ColumnHeader type={type} openEditor={openForm || this.toggleNewTicket} />
				<div className="content">
					{this.renderTickets()}
					{showNewTicket && this.renderNewTicket()}
				</div>
			</div>
		);
	}

	/**
	 * Opens a new ticket that doesn't need a form
	 */
	private toggleNewTicket = () => {
		this.setState({ showNewTicket: !this.state.showNewTicket });
	}

	/**
	 * Shows a ticket in edit mode
	 */
	private renderNewTicket = () => {
		const { type, updateTicket, deleteTicket, createTicket } = this.props;

		return (
			<Ticket
				type={type}
				focused={true}
				updateTicket={updateTicket}
				deleteTicket={deleteTicket}
				createTicket={createTicket}
				closeNewTicket={this.toggleNewTicket}
			/>
		);
	}

	/**
	 * Shows all tickets from db
	 */
	private renderTickets = () => {
		const { tickets, type, updateTicket, openForm, deleteTicket, createTicket } = this.props;
		return tickets.map((data, index) => (
			<Ticket
				data={data}
				key={index}
				type={type}
				focused={false}
				openForm={openForm}
				updateTicket={updateTicket}
				deleteTicket={deleteTicket}
				createTicket={createTicket}
				closeNewTicket={this.toggleNewTicket}
			/>
		));
	}
}
