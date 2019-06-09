import * as React from "react";
import "./ticketDisplay.less"
import { TicketData, CommonFields } from "../../types";
import { editSvg, trashSvg } from "../Svg/Svg";

export interface TicketDisplayProps {
	openEditor: (props?: TicketData) => void;
	data: TicketData;
	deleteTicket: (data: CommonFields) => void;
	openTextArea: () => void;
}

export class TicketDisplay extends React.Component<TicketDisplayProps> {
	public render() {
		const { openTextArea, data: { name } } = this.props;
		return (
			<div className="ticketDisplay">
				<span onClick={this.openEditorWithInfo}>
					{name}
				</span>
				<div className="ticketOptions">
					<div className="ticketIcon" onClick={openTextArea}>
						{editSvg}
					</div>
					<div className="ticketIcon" onClick={this.deleteTicket}>
						{trashSvg}
					</div>
				</div>
			</div>
		);
	}

	/**
	 * Opens editor with existing ticket data
	 */
	private openEditorWithInfo = () => {
		const { openEditor, data } = this.props;
		openEditor(data);
	}

	/**
	 * Deletes the ticket from db
	 */
	private deleteTicket = () => {
		const { deleteTicket, data: { id, name } } = this.props;
		deleteTicket({ id, name });
	}
}