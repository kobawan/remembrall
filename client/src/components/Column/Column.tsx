import * as React from "react";
import { MutationFn } from "react-apollo";
import "./column.less";
import { Ticket } from "../Ticket/Ticket";
import { ColumnType, CommonFields } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormOverlay } from "../FormOverlay/FormOverlay";

interface ColumnProps {
	type: ColumnType;
	tickets: CommonFields[];
	createTicket: MutationFn;
	deleteTicket: MutationFn;
	updateTicket: MutationFn;
}

interface ColumnState {
	formOpened: boolean;
}

export class Column extends React.Component<ColumnProps, ColumnState> {
	public state: ColumnState = {
		formOpened: false
	};

	public render() {
		const { type, createTicket, deleteTicket } = this.props;
		const { formOpened } = this.state;

		return (<>
			<div className="column">
				<div className="header" onClick={this.toggleForm}>
					<span>{type}</span>
					{plusSvg}
				</div>
				<div className="content">
					{this.renderTickets()}
				</div>
			</div>
			{formOpened && (
				<FormOverlay
					closeForm={this.toggleForm}
					createTicket={createTicket}
					deleteTicket={deleteTicket}
				/>
			)}
		</>);
	}

	private toggleForm = () => {
		this.setState({ formOpened: !this.state.formOpened });
	}

	private renderTickets = () => {
		const { tickets, type, updateTicket } = this.props;
		return tickets.map((data, index) => (
			<Ticket
				{...data}
				key={index}
				type={type}
				toggleForm={this.toggleForm}
				updateTicket={updateTicket}
			/>
		));
	}
}
