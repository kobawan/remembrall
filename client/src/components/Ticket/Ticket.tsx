import * as React from "react";
import { MutationFn } from "react-apollo";
import "./ticket.less";
import { editSvg } from "../Svg/Svg";
import { ColumnType, AllColumnFields } from "../../types";

export interface TicketProps {
	type: ColumnType;
	toggleForm: () => void;
	updateTicket: MutationFn;
}

interface TicketState {
	name: string;
	focused: boolean;
}

export class Ticket extends React.PureComponent<TicketProps & Partial<AllColumnFields>, TicketState> {
	public state: TicketState = {
		name: this.props.name || "",
		focused: false,
	};
	private textAreaRef = React.createRef<HTMLTextAreaElement>();

	public render() {
		const { name, focused } = this.state;

		return (<>
			<div className="ticket">
				{focused
					? <textarea
						ref={this.textAreaRef}
						onChange={this.handleInput}
						onBlur={this.handleBlur}
						value={name}
						placeholder="Name"
					/> : <>
						<span onClick={this.openForm}>
							{name}
						</span>
						<div className="editWrapper" onClick={this.handleFocus} >
							{editSvg}
						</div>
					</>
				}
			</div>
		</>);
	}

	private openForm = () => {
		this.props.toggleForm();
	}

	/**
	 * Updates textarea input
	 */
	private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ name: e.target.value });
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
		if(this.props.name !== this.state.name && this.state.name) {
			this.props.updateTicket({
				variables: {
					id: this.props.id,
					params: { name: this.state.name },
				}
			});
		}
		this.setState({ focused: false });
	}
}
