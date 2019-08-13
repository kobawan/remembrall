import React, { useContext } from "react";
import "./ticketDisplay.less";
import { TicketData, CommonFields } from "../../types";
import { editSvg, trashSvg, filterSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { openFilterTooltipAction } from "../ColumnsManager/actions";

const formatDisplayFields = (data: TicketData, key: string) => {
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
	return value;
};

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

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
	openTextArea,
	deleteTicket,
	data,
	openEditor,
	displayFields,
	displayDirection,
}) => {
	const ref = React.createRef<HTMLDivElement>();
	const { dispatch } = useContext(ReducerContext);

	const showFilterOptions = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		if(!ref.current) {
			return;
		}
		const { left, top, width } = ref.current.getBoundingClientRect();
		openFilterTooltipAction(dispatch, {
			top,
			left,
			ticketWidth: width,
		});
	};

	const editName = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		openTextArea();
	};

	const removeTicket = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		const { id, name } = data;
		deleteTicket({ id, name });
	};

	const renderDisplayedValues = () => {
		return displayFields.map((key, i) => (
			<div key={i} className={`ticketDisplayInfoRow ${displayDirection}`}>
				<small className="ticketDisplayKey">{key}:</small>
				<span>{formatDisplayFields(data, key)}</span>
			</div>
		));
	};

	return (
		<div className="ticketDisplay" onClick={() => openEditor(data)} ref={ref}>
			{renderDisplayedValues()}
			<div className="ticketOptions">
				<div className="ticketIcon" onClick={editName}>
					{editSvg}
				</div>
				<div className="ticketIcon" onClick={removeTicket}>
					{trashSvg}
				</div>
				<div className="ticketIcon" onClick={showFilterOptions}>
					{filterSvg}
				</div>
			</div>
		</div>
	);
};
