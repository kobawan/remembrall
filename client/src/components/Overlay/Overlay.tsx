import * as React from "react";
import "./overlay.less";

interface OverlayProps {
	onClick?: () => void;
	zIndex: number;
}

export class Overlay extends React.PureComponent<OverlayProps> {
	public render() {
		const { onClick, zIndex } = this.props;
		return <div className="overlay" style={{ zIndex }} onClick={onClick} />;
	}
}
