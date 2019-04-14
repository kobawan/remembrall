import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";

interface ColumnProps {
	type: ColumnType;
	tickets: CommonFields[];
	createTicket: MutationFn;
	deleteTicket: MutationFn;
}

interface ColumnState {
	newTicket: boolean;
}

export class Column extends React.Component<ColumnProps, ColumnState> {
	public state: ColumnState = {
		newTicket: false,
	};

	public render() {
		const { type } = this.props;
		const { newTicket } = this.state;

		return (
			<div className="column">
				<div className="header" onClick={this.openNewTicket}>
					<span>{type}</span>
					{plusSvg}
				</div>
				<div className="content">
					{this.renderTickets()}
					{newTicket && this.renderNewTicket()}
				</div>
			</div>
		);
	}

	private openNewTicket = () => {
		this.setState({ newTicket: true });
	}

	private createTicket = (name: string) => {
		this.setState({ newTicket: false });
		this.props.createTicket({ variables: { params: { name } } });
	}

	private renderNewTicket = () => {
		return (
			<Ticket
				type={this.props.type}
				inEditMode={true}
				deleteTicket={this.props.deleteTicket}
				createTicket={this.createTicket}
			/>
		);
	}

	private renderTickets = () => {
		return this.props.tickets.map((data, index) => {
			return (
				<Ticket
					{...data}
					key={index}
					type={this.props.type}
					inEditMode={false}
					deleteTicket={this.props.deleteTicket}
					createTicket={this.createTicket}
				/>
			);
		});
	}
}
