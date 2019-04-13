import * as React from "react";
import "./loading.less";

import { spinnerSvg } from "../Svg/Svg";

export class Loading extends React.PureComponent {
	public render() {
		return (
			<div className="loading">
				{spinnerSvg}
			</div>
		);
	}
}
