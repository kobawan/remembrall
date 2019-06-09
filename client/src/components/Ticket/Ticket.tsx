import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./ticket.less";
import { ColumnType, TicketData, CommonFields } from "../../types";
import { TicketTextArea } from "../TicketTextArea/TicketTextArea";
import { TicketDisplay } from "../TicketDisplay/TicketDisplay";

export interface TicketProps {
	type: ColumnType;
	openForm?: (props?: TicketData) => void;
	data?: TicketData;
	focused: boolean;
	closeNewTicket: () => void;
	updateTicket: MutationFn;
	createTicket: MutationFn;
	deleteTicket: (data: CommonFields) => void;
}

interface TicketState {
	focused: boolean;
	withError: boolean;
}

export class Ticket extends React.Component<TicketProps, TicketState> {
	public state: TicketState = {
		focused: this.props.focused,
		withError: false,
	};

	public shouldComponentUpdate(nextProps: TicketProps, nextState: TicketState) {
		return !isEqual(this.props.data, nextProps.data) || !isEqual(this.state, nextState);
	}

	public render() {
		const { focused, withError } = this.state;
		const {
			data,
			openForm,
			deleteTicket,
			createTicket,
			updateTicket,
			closeNewTicket,
			type,
		} = this.props;

		return (<>
			<div className={`ticket ${withError ? "ticketError" : "" }`}>
				{!focused && data
					? (
						<TicketDisplay
							data={data}
							openEditor={openForm || this.toggleTextArea}
							deleteTicket={deleteTicket}
							openTextArea={this.toggleTextArea}
						/>
					) : (
						<TicketTextArea
							data={data}
							key={name}
							type={type}
							updateTicket={updateTicket}
							createTicket={createTicket}
							close={this.toggleTextArea}
							toggleError={this.toggleError}
							closeNewTicket={closeNewTicket}
						/>
					)
				}
			</div>
		</>);
	}

	/**
	 * Show ticket with red border error
	 */
	private toggleError = (withError: boolean) => {
		this.setState({ withError });
	}

	/**
	 * Toggles the textarea element for editing
	 */
	private toggleTextArea = () => {
		this.setState({ focused: !this.state.focused });
	}
}
