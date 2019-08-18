import React, { useContext } from "react";
import cx from "classnames";
import * as styles from "./form.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex, CommonFields, AllColumnFields } from "../../types";
import { filterSvg, trashSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { openFilterTooltipAction } from "../ColumnsManager/actions";
import { FilterType } from "../FilterTooltip/FilterTooltip";

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
  deleteTicket: (data: CommonFields) => void;
  ticket?: AllColumnFields;
}

export const Form = ({
  Title,
  Content,
  submitForm,
  size,
  formHasChangesFn,
  openChangesPopup,
  closeForm,
  deleteTicket,
  ticket,
}: FormProps) => {
  const ref = React.createRef<HTMLButtonElement>();
  const { dispatch } = useContext(ReducerContext);

  const safeCloseForm = () => formHasChangesFn() ? openChangesPopup() : closeForm();
  const removeTicket = () => deleteTicket({ name: ticket!.name, id: ticket!.id });
  const showFilterOptions = () => {
    if(!ref.current) {
      return;
    }
    const { left, top, width } = ref.current.getBoundingClientRect();
    openFilterTooltipAction(dispatch, {
      top,
      left,
      ticketWidth: width,
      ticket,
      filters: [FilterType.linked],
      withRemoveAllButton: false,
    });
  };

  return (<>
    <Overlay onClick={safeCloseForm} zIndex={OverlayZIndex.Form} />
    <div className={cx(styles.form, formSizeMap[size])}>
      {ticket && <>
        <button className={styles.iconLeft} onClick={showFilterOptions} ref={ref}>
          {filterSvg}
        </button>
        <button className={styles.iconRight} onClick={removeTicket}>
          {trashSvg}
        </button>
      </>}
      <div className={styles.title}>
        {Title}
      </div>
      <div className={styles.content}>
        {Content}
      </div>
      <div className={styles.footer}>
        <button className={styles.button} onClick={safeCloseForm}>Cancel</button>
        <button className={styles.button} onClick={submitForm}>Save</button>
      </div>
    </div>
  </>);
};
