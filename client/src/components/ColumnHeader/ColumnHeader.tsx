import React, { useCallback } from "react";
import "./columnHeader.less";
import { ColumnType, TicketData } from "../../types";
import { plusSvg } from "../Svg/Svg";

interface ColumnHeaderProps {
	type: ColumnType;
	openEditor: (props?: TicketData) => void;
}

export const ColumnHeader = React.memo(({ type, openEditor }: ColumnHeaderProps) => {
	const openNewTicket = useCallback(() => openEditor(), []);

	return (
		<div className="columnHeader" onClick={openNewTicket}>
			<span>{type}</span>
			{plusSvg}
		</div>
	);
});
