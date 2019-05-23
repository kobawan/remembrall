import * as React from "react";
import "./columnHeader.less";
import { ColumnType, TicketData } from "../../types";
import { plusSvg } from "../Svg/Svg";

interface ColumnHeaderProps {
	type: ColumnType;
	openForm: (props?: TicketData) => void;
}

export class ColumnHeader extends React.PureComponent<ColumnHeaderProps> {
	public render() {
		const { type } = this.props;

		return (
			<div className="columnHeader" onClick={this.openNewForm}>
				<span>{type}</span>
				{plusSvg}
			</div>
		);
	}

	private openNewForm = () => {
		this.props.openForm();
	}
}
