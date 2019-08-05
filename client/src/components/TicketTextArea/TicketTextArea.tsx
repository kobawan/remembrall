import * as React from "react";
import { MutationFn } from "react-apollo";
import "./ticketTextArea.less";
import { TicketData, ColumnType } from "../../types";

interface TicketTextAreaProps {
	data?: TicketData;
	type: ColumnType;
	updateTicket: MutationFn<any, { id: string, params: any }>;
	createTicket: MutationFn<any, { params: any }>;
	close: () => void;
	toggleError: (toggleError: boolean) => void;
	closeNewTicket: () => void;
}

interface TicketTextAreaState {
	value: string;
}

export class TicketTextArea extends React.Component<TicketTextAreaProps, TicketTextAreaState> {
	public state: TicketTextAreaState = {
		value: this.props.data ? this.props.data.name : "",
	};

	public render() {
		const { value } = this.state;
		return (
			<textarea
				onChange={this.handleInput}
				onKeyDown={this.handleKeyDown}
				onBlur={this.submitChange}
				value={value}
				placeholder="Name"
				className="ticketEditer"
				autoFocus={true}
			/>
		);
	}

	/**
	 * Updates textarea input
	 */
	private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.props.toggleError(false);
		this.setState({ value: e.currentTarget.value });
	}

	/**
	 * Updates ticket name on enter
	 */
	private handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		// enter
		if(e.keyCode === 13) {
			e.preventDefault();
			this.submitChange();
		}
	}

	/**
	 * Updates or creates the ticket
	 */
	private submitChange = async () => {
		const { data, close, closeNewTicket, type } = this.props;
		const { value } = this.state;

		if(!value) {
			closeNewTicket();
			return;
		}

		/**
		 * @todo show error on incompatible naming
		 */
		if(data) {
			// Update ticket
			if(data.name !== value) {
				await this.props.updateTicket({
					variables: {
						id: data.id,
						params: { name: type === ColumnType.Projects ? value : value.toLowerCase() },
					},
				});
			}
			close();
		} else {
			// Create ticket
			await this.props.createTicket({
				variables: {
					params: { name: type === ColumnType.Projects ? value : value.toLowerCase() },
				}
			});
			closeNewTicket();
		}
	}
}
