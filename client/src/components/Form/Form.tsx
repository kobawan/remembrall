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
  submitForm: () => void;
  size: FormSize;
  formHasChangesFn: () => boolean;
  openChangesPopup: () => void;
  closeForm: () => void;
}

export const Form = React.memo(({
  Title,
  Content,
  submitForm,
  size,
  formHasChangesFn,
  openChangesPopup,
  closeForm,
}: FormProps) => {
  const safeCloseForm = () => formHasChangesFn() ? openChangesPopup() : closeForm();

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
