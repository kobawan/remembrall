import * as React from "react";
import "./ticketDisplay.less";
import { TicketData, CommonFields } from "../../types";
import { editSvg, trashSvg } from "../Svg/Svg";

export enum DisplayDirection {
	column = "ticketDisplayColumn",
	row = "ticketDisplayRow",
}

export interface TicketDisplayProps {
	openEditor: (props?: TicketData) => void;
	data: TicketData;
	deleteTicket: (data: CommonFields) => void;
	openTextArea: () => void;
	displayFields: string[];
	displayDirection: DisplayDirection;
}

export class TicketDisplay extends React.Component<TicketDisplayProps> {
	public render() {
		return (
			<div className="ticketDisplay" onClick={this.openEditorWithInfo}>
				{this.renderDisplayedValues()}
				<div className="ticketOptions">
					<div className="ticketIcon" onClick={this.editName}>
						{editSvg}
					</div>
					<div className="ticketIcon" onClick={this.removeTicket}>
						{trashSvg}
					</div>
				</div>
			</div>
		);
	}

	private editName = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		this.props.openTextArea();
	}

	private removeTicket = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const { deleteTicket, data: { id, name } } = this.props;

		deleteTicket({ id, name });
	}

	/**
	 * Opens editor with existing ticket data
	 */
	private openEditorWithInfo = () => {
		const { openEditor, data } = this.props;
		openEditor(data);
	}

	private renderDisplayedValues = () => {
		const {
			displayFields,
			data,
			displayDirection,
		} = this.props;

		return displayFields.map((key, i) => {
			if(!data.hasOwnProperty(key)) {
				return null;
			}
			let value = null;
			if(
				data[key] === null
				|| data[key] === undefined
				|| typeof data[key] === "string" && !data[key].length
			) {
				value = "-";
			} else if(typeof data[key] === "object") {
				const res = data[key].map(({ name }: { name: string }) => name).join(", ");
				value = res.length ? res : "-";
			} else {
				value = data[key].toString().replace(";", " ");
			}

			return (
				<div key={i} className={`ticketDisplayInfoRow ${displayDirection}`}>
					<small className="ticketDisplayKey">{key}:</small>
					<span>{value}</span>
				</div>
			);
		});
	}
}