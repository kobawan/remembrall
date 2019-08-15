import React, { useState, useContext } from "react";
import "./filterTooltip.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";
import { Checkbox } from "../Checkbox/Checkbox";
import { ReducerContext } from "../ColumnsManager/context";
import { closeFilterTooltipAction, setFilterAction } from "../ColumnsManager/actions";

const TICKET_TOOLTIP_SIZE = 200;

export enum FilterType {
	linked = "linked",
	unused = "unused",
}

const FilterTooltipCheckboxText = {
	[FilterType.linked]: "Linked resources",
	[FilterType.unused]: "All available resources",
};

export enum FilterTooltipPosition {
	left = "ticketTooltipLeft",
	right = "ticketTooltipRight",
}

export interface BasicFilterTooltipProps {
	top: number;
	left: number;
	ticketWidth: number;
}

export const FilterTooltip: React.FC<BasicFilterTooltipProps> = ({
	top,
	left,
	ticketWidth,
}) => {
	const [checkboxLinkedChecked, setCheckboxLinkedCheckedState] = useState(false);
	const [checkboxUnusedChecked, setCheckboxUnusedCheckedState] = useState(false);
	const { dispatch } = useContext(ReducerContext);

	// @todo handle window resizing
	const showLeft = document.body.clientWidth - left - ticketWidth < TICKET_TOOLTIP_SIZE;
	const position = showLeft ? FilterTooltipPosition.left : FilterTooltipPosition.right;
	const style: React.CSSProperties = {
		top: `${top}px`,
		left: `${showLeft ? left : left + ticketWidth}px`,
	};

	const closeTooltip = () => closeFilterTooltipAction(dispatch);
	const handleOnClick = () => {
		closeTooltip();

		if(checkboxUnusedChecked) {
			setFilterAction(dispatch, FilterType.unused);
		}
		if(checkboxLinkedChecked) {
			setFilterAction(dispatch, FilterType.linked);
		}
	};

	return (
		<div>
			<Overlay zIndex={OverlayZIndex.Tooltip} onClick={closeTooltip} />
			<div className={`ticketTooltip ${position}`} style={style}>
				<span className="ticketTooltipTitle">Filter by:</span>
				<Checkbox
					text={FilterTooltipCheckboxText.linked}
					isChecked={checkboxLinkedChecked}
					onChange={() => setCheckboxLinkedCheckedState(!checkboxLinkedChecked)}
				/>
				<Checkbox
					text={FilterTooltipCheckboxText.unused}
					isChecked={checkboxUnusedChecked}
					onChange={() => setCheckboxUnusedCheckedState(!checkboxUnusedChecked)}
				/>
				<button className="ticketTooltipButton" onClick={handleOnClick}>Apply</button>
			</div>
		</div>
	);
};
