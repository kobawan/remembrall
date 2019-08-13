import React from "react";
import "./form.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";

export enum FormSize {
	small = "small",
	medium = "medium",
	large = "large",
}

interface FormProps {
	Title: React.ReactNode;
	Content: React.ReactNode;
	safeCloseForm: () => void;
	submitForm: () => void;
	size: FormSize;
}

export const Form = React.memo(({
	Title,
	Content,
	safeCloseForm,
	submitForm,
	size,
}: FormProps) => {
	return (<>
		<Overlay onClick={safeCloseForm} zIndex={OverlayZIndex.Form} />
		<div className={`form ${size}`}>
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
