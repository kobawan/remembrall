import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./ticket.less";
import { editSvg } from "../Svg/Svg";
import { ColumnType, TicketData } from "../../types";

interface TicketTextAreaProps {
	name: string;
	id: string;
	updateTicket: MutationFn;
	close: () => void;
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
				onBlur={this.handleBlur}
				value={value}
				placeholder="Name"
			/>
		);
	}

	/**
	 * Updates textarea input
	 */
	private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ value: e.currentTarget.value });
	}

	/**
	 * Updates the ticket's name
	 */
	private handleBlur = () => {
		const { name, id, close } = this.props;
		const { value } = this.state;
		if(name !== value && value) {
			this.props.updateTicket({
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
	data: TicketData;
}

interface TicketState {
	focused: boolean;
}

export class Ticket extends React.Component<TicketProps, TicketState> {
	public state: TicketState = {
		focused: false,
	};

	public shouldComponentUpdate(nextProps: TicketProps, nextState: TicketState) {
		return !isEqual(this.props.data, nextProps.data) || this.state.focused !== nextState.focused;
	}

	public render() {
		const { focused } = this.state;
		const { name, id } = this.props.data;

		return (<>
			<div className="ticket">
				{focused
					? (
						<TicketTextArea
							name={name}
							id={id}
							key={name}
							updateTicket={this.props.updateTicket}
							close={this.toggleTextArea}
						/>
					) : <>
						<span onClick={this.openFormWithInfo}>
							{name}
						</span>
						<div className="editWrapper" onClick={this.toggleTextArea} >
							{editSvg}
						</div>
					</>
				}
			</div>
		</>);
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
		this.props.openForm(this.props.data);
	}
}
