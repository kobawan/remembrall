import * as React from "react";
import "./formOverlay.less";

interface FormOverlayProps {
	closeForm: () => void;
}

export class FormOverlay extends React.PureComponent<FormOverlayProps> {
	public render() {
		return (
			<div className="formOverlay" onClick={this.handleOnClick}>
				<div className="form">
				</div>
			</div>
		);
	}

	private handleOnClick = () => {
		this.props.closeForm();
	}
}
