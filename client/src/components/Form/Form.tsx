import * as React from "react";
import "./form.less";
import { Overlay } from "../Overlay/Overlay";

interface FormProps {
	Title: JSX.Element;
	Content: JSX.Element;
	safeCloseForm: () => void;
	submitForm: () => void;
}

export class Form extends React.PureComponent<FormProps> {
	public render() {
		const { safeCloseForm, submitForm, Title, Content } = this.props;

		return (<>
			<Overlay onClick={safeCloseForm} zIndex={96} />
			<div className="form">
				{Title}
				<div className="content">
					{Content}
				</div>
				<div className="footer">
					<button onClick={safeCloseForm}>Cancel</button>
					<button onClick={submitForm}>Save</button>
				</div>
			</div>
		</>);
	}
}