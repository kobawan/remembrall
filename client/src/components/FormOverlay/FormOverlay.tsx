import * as React from "react";
import "./formOverlay.less";

interface FormOverlayProps {
	closeForm: () => void;
}

export class FormOverlay extends React.PureComponent<FormOverlayProps> {
	public render() {
		return <div className="formOverlay" onClick={this.props.closeForm} />;
	}
}
