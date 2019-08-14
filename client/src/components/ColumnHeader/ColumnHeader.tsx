import React from "react";
import "./columnHeader.less";
import { ColumnType } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormManagerState } from "../ColumnsManager/types";

interface ColumnHeaderProps {
	type: ColumnType;
	openForm: (props: FormManagerState) => void;
}

export const ColumnHeader = React.memo(({ type, openForm }: ColumnHeaderProps) => {
	return (
		<div className="columnHeader" onClick={() => openForm({ formOpened: type })}>
			<span>{type}</span>
			{plusSvg}
		</div>
	);
});
