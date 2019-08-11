import React from "react";
import "./form.less";
import { Overlay } from "../Overlay/Overlay";

interface FormProps {
	Title: React.ReactNode;
	Content: React.ReactNode;
	safeCloseForm: () => void;
	submitForm: () => void;
}

export const Form = React.memo(({
	Title,
	Content,
	safeCloseForm,
	submitForm,
}: FormProps) => {
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
});
