import * as React from "react";
import "./overlay.less";

interface OverlayProps {
	onClick?: () => void;
}

export class Overlay extends React.PureComponent<OverlayProps> {
	public render() {
		return <div className="overlay" onClick={this.props.onClick} />;
	}
}
