import React, { useState } from "react";
import "./ticketTooltip.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";
import { Checkbox } from "../checkbox/Checkbox";

const TICKET_TOOLTIP_SIZE = 200;

enum TicketTooltipCheckboxText {
	linked = "Linked resources",
	unused = "All available resources",
}

export enum TicketTooltipPosition {
	left = "ticketTooltipLeft",
	right = "ticketTooltipRight",
}

export interface BasicTicketTooltipProps {
	top: number;
	left: number;
	ticketWidth: number;
}

interface TicketTooltipProps extends BasicTicketTooltipProps {
	closeTooltip: () => void;
}

export const TicketTooltip: React.FC<TicketTooltipProps> = ({
	top,
	left,
	closeTooltip,
	ticketWidth,
}) => {
	const [checkboxLinkedChecked, setCheckboxLinkedCheckedState] = useState(false);
	const [checkboxUnusedChecked, setCheckboxUnusedCheckedState] = useState(false);

	// @todo handle window resizing
	const showLeft = document.body.clientWidth - left - ticketWidth < TICKET_TOOLTIP_SIZE;
	const position = showLeft ? TicketTooltipPosition.left : TicketTooltipPosition.right;
	const style: React.CSSProperties = {
		top: `${top}px`,
		left: `${showLeft ? left : left + ticketWidth}px`,
	};
	const handleOnClick = () => {
		closeTooltip();

		if(checkboxLinkedChecked || checkboxUnusedChecked) {
		}
	};

	return (
		<div>
			<Overlay zIndex={OverlayZIndex.Tooltip} onClick={closeTooltip} />
			<div className={`ticketTooltip ${position}`} style={style}>
				<span className="ticketTooltipTitle">Filter by:</span>
				<Checkbox
					text={TicketTooltipCheckboxText.linked}
					isChecked={checkboxLinkedChecked}
					onChange={() => setCheckboxLinkedCheckedState(!checkboxLinkedChecked)}
				/>
				<Checkbox
					text={TicketTooltipCheckboxText.unused}
					isChecked={checkboxUnusedChecked}
					onChange={() => setCheckboxUnusedCheckedState(!checkboxUnusedChecked)}
				/>
				<button className="ticketTooltipButton" onClick={handleOnClick}>Apply</button>
			</div>
		</div>
	);
};
