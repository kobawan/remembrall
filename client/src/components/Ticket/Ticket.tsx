import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./ticket.less";
import { ColumnType, TicketData, CommonFields } from "../../types";
import { TicketTextArea } from "../TicketTextArea/TicketTextArea";
import { TicketDisplay, DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { BasicTicketTooltipProps } from "../TicketTooltip/TicketTooltip";

export interface TicketProps {
	type: ColumnType;
	openForm: (props?: TicketData) => void;
	data: TicketData;
	displayFields: string[];
	focused: boolean;
	updateTicket: MutationFn<any, { id: string, params: any }>;
	deleteTicket: (data: CommonFields) => void;
	displayDirection: DisplayDirection;
	showTooltip: (props: BasicTicketTooltipProps) => void;
	closeTooltip: () => void;
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
			updateTicket,
			type,
			displayFields,
			displayDirection,
			showTooltip,
			closeTooltip,
		} = this.props;

		return (<>
			<div className={`ticket ${withError ? "ticketError" : "" }`}>
				{!focused && data
					? (
						<TicketDisplay
							data={data}
							openEditor={openForm}
							deleteTicket={deleteTicket}
							openTextArea={this.toggleTextArea}
							displayFields={displayFields}
							displayDirection={displayDirection}
							showTooltip={showTooltip}
							closeTooltip={closeTooltip}
						/>
					) : (
						<TicketTextArea
							data={data}
							key={name}
							type={type}
							updateTicket={updateTicket}
							close={this.toggleTextArea}
							toggleError={this.toggleError}
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
