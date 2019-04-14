import * as React from "react";
import { MutationFn } from "react-apollo";
import "./ticket.less";
import { editSvg } from "../Svg/Svg";
import { FormOverlay } from "../FormOverlay/FormOverlay";
import { ColumnType, AllColumnFields } from "../../types";

export interface TicketProps {
	inEditMode: boolean;
	type: ColumnType;
	deleteTicket: MutationFn;
	createTicket: (name: string) => void;
}

interface TicketState {
	name: string;
	focused: boolean;
	formOpened: boolean;
}

export class Ticket extends React.PureComponent<TicketProps & Partial<AllColumnFields>, TicketState> {
	public state: TicketState = {
		name: this.props.name || "",
		focused: this.props.inEditMode,
		formOpened: false,
	};
	private textAreaRef = React.createRef<HTMLTextAreaElement>();

	public componentDidMount() {
		if (this.props.inEditMode && this.textAreaRef.current) {
			this.textAreaRef.current.focus();
		}
	}

	public render() {
		const { name, focused, formOpened } = this.state;

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
						<span onClick={this.toggleForm}>
							{name}
						</span>
						<div className="editWrapper" onClick={this.handleFocus} >
							{editSvg}
						</div>
					</>
				}
			</div>
			{formOpened && <FormOverlay closeForm={this.toggleForm}/>}
		</>);
	}

	private toggleForm = () => {
		this.setState({ formOpened: !this.state.formOpened });
	}

	private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		this.setState({ name: e.target.value });
	}

	private handleFocus = () => {
		this.setState({ focused: true }, () => {
			if (this.textAreaRef.current) {
				this.textAreaRef.current.focus();
			}
		});
	}

	private handleBlur = () => {
		if(!this.state.name) {
			/**
			 * @todo only delete ticket if it doesn't have any props
			 */
			this.props.deleteTicket({ variables: { id: this.props.id } });
		}
		if (this.props.name !== this.state.name) {
			if (!this.props.name) {
				this.props.createTicket(this.state.name);
			} else {
				/**
				 * @todo update ticket mutation
				 */
			}
		}
		this.setState({ focused: false });
	}
}
