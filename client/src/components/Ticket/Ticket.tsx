import * as React from "react";
import { MutationFn } from "react-apollo";
import isEqual from "lodash.isequal";
import "./ticket.less";
import { editSvg } from "../Svg/Svg";
import { ColumnType, TicketData } from "../../types";

export interface TicketProps {
	type: ColumnType;
	openForm: (props?: TicketData) => void;
	updateTicket: MutationFn;
	data: TicketData;
}

interface TicketState {
	value: string;
	focused: boolean;
}

export class Ticket extends React.Component<TicketProps, TicketState> {
	public state: TicketState = {
		value: this.props.data.name,
		focused: false,
	};
	private textAreaRef = React.createRef<HTMLTextAreaElement>();

	public shouldComponentUpdate(nextProps: TicketProps, nextState: TicketState) {
		return !isEqual(this.props.data, nextProps.data) || !isEqual(this.state, nextState);
	}

	public render() {
		const { value, focused } = this.state;

		return (<>
			<div className="ticket">
				{focused
					? <textarea
						ref={this.textAreaRef}
						onChange={this.handleInput}
						onBlur={this.handleBlur}
						value={value}
						placeholder="Name"
					/> : <>
						<span onClick={this.openFormWithInfo}>
							{value}
						</span>
						<div className="editWrapper" onClick={this.handleFocus} >
							{editSvg}
						</div>
					</>
				}
			</div>
		</>);
	}

	/**
	 * Updates textarea input
	 */
	private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ value: e.currentTarget.value });
	}

	/**
	 * Sets focus on the textarea element for editing
	 */
	private handleFocus = () => {
		this.setState({ focused: true }, () => {
			if (this.textAreaRef.current) {
				this.textAreaRef.current.focus();
			}
		});
	}

	/**
	 * Updates the ticket's name
	 */
	private handleBlur = () => {
		const { data } = this.props;
		const { value } = this.state;
		if(data.name !== value && value) {
			this.props.updateTicket({
				variables: {
					id: data.id,
					params: { name: value },
				},
			});
		}
		this.setState({ focused: false });
	}

	/**
	 * Opens form with existing ticket data
	 */
	private openFormWithInfo = () => {
		this.props.openForm(this.props.data);
	}
}
