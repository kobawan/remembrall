import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";

interface ColumnProps {
	type: ColumnType;
	tickets: CommonFields[];
	openForm: (props?: CommonFields) => void;
	updateTicket: MutationFn<any, any>;
}

export class Column extends React.Component<ColumnProps> {
	public render() {
		const { type } = this.props;

		return (
			<div className="column">
				<div className="header" onClick={this.openNewForm}>
					<span>{type}</span>
					{plusSvg}
				</div>
				<div className="content">
					{this.renderTickets()}
				</div>
			</div>
		);
	}

	private openNewForm = () => {
		this.props.openForm();
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
