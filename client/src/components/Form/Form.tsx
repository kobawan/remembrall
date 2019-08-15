import React from "react";
import cx from "classnames";
import * as styles from "./form.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";

export enum FormSize {
  small = "small",
  medium = "medium",
  large = "large",
}

const formSizeMap = {
  [FormSize.small]: styles.small,
  [FormSize.medium]: styles.medium,
  [FormSize.large]: styles.large,
};

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
    <div className={cx(styles.form, formSizeMap[size])}>
      {Title}
      <div className={styles.content}>
        {Content}
      </div>
      <div className={styles.footer}>
        <button className={styles.button} onClick={safeCloseForm}>Cancel</button>
        <button className={styles.button} onClick={submitForm}>Save</button>
      </div>
    </div>
  </>);
});
