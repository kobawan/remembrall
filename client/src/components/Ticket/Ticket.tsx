import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./ticket.less";
import { editSvg, trashSvg } from "../Svg/Svg";
import { ColumnType, TicketData, CommonFields } from "../../types";

interface TicketTextAreaProps {
	name: string;
	id: string;
	updateTicket: MutationFn;
	close: () => void;
	toggleError: (toggleError: boolean) => void;
}

interface TicketTextAreaState {
	value: string;
}

class TicketTextArea extends React.PureComponent<TicketTextAreaProps, TicketTextAreaState> {
	public state: TicketTextAreaState = {
		value: this.props.name,
	};
	private textAreaRef = React.createRef<HTMLTextAreaElement>();

	public componentDidMount() {
		if (this.textAreaRef.current) {
			this.textAreaRef.current.focus();
		}
	}

	public render() {
		const { value } = this.state;
		return (
			<textarea
				ref={this.textAreaRef}
				onChange={this.handleInput}
				onKeyDown={this.handleKeyDown}
				onBlur={this.updateName}
				value={value}
				placeholder="Name"
				className="ticketEditer"
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
			this.updateName();
		}
	}

	/**
	 * Updates the ticket's name
	 */
	private updateName = async () => {
		const { name, id, close, toggleError } = this.props;
		const { value } = this.state;
		if(!value) {
			toggleError(true);
			return;
		}

		if(name !== value) {
			await this.props.updateTicket({
				variables: {
					id,
					params: { name: value },
				},
			});
		}
		close();
	}
}

export interface TicketProps {
	type: ColumnType;
	openForm: (props?: TicketData) => void;
	updateTicket: MutationFn;
	deleteTicket: (data: CommonFields) => void;
	data: TicketData;
}

interface TicketState {
	focused: boolean;
	withError: boolean;
}

export class Ticket extends React.Component<TicketProps, TicketState> {
	public state: TicketState = {
		focused: false,
		withError: false,
	};

	public shouldComponentUpdate(nextProps: TicketProps, nextState: TicketState) {
		return !isEqual(this.props.data, nextProps.data) || !isEqual(this.state, nextState);
	}

	public render() {
		const { focused, withError } = this.state;
		const { name, id } = this.props.data;

		return (<>
			<div className={`ticket ${withError ? "ticketError" : "" }`}>
				{focused
					? (
						<TicketTextArea
							name={name}
							id={id}
							key={name}
							updateTicket={this.props.updateTicket}
							close={this.toggleTextArea}
							toggleError={this.toggleError}
						/>
					) : <>
						<span onClick={this.openFormWithInfo}>
							{name}
						</span>
						<div className="ticketOptions">
							<div className="ticketIcon" onClick={this.toggleTextArea}>
								{editSvg}
							</div>
							<div className="ticketIcon" onClick={this.deleteTicket}>
								{trashSvg}
							</div>
						</div>
					</>
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

	/**
	 * Opens form with existing ticket data
	 */
	private openFormWithInfo = () => {
		const { openForm, data } = this.props;
		openForm(data);
	}

	/**
	 * Deletes the ticket from db
	 */
	private deleteTicket = () => {
		const { deleteTicket, data: { id, name } } = this.props;
		deleteTicket({ id, name });
	}
}
