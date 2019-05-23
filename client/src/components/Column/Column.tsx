import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, TicketData } from "../../types";
import { ColumnHeader } from "../ColumnHeader/ColumnHeader";

interface ColumnProps {
	type: ColumnType;
	tickets: TicketData[];
	openForm: (props?: TicketData) => void;
	updateTicket: MutationFn<any, any>;
}

export class Column extends React.Component<ColumnProps> {
	public shouldComponentUpdate(nextProps: ColumnProps) {
		return !isEqual(this.props.tickets, nextProps.tickets);
	}

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
		const { tickets, type, updateTicket, openForm } = this.props;
		return tickets.map((data, index) => (
			<Ticket
				data={data}
				key={index}
				type={type}
				openForm={openForm}
				updateTicket={updateTicket}
			/>
		));
	}
}
