import React from "react";
import * as styles from "./popup.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";

export enum PopupMessage {
  changes = "Are you sure you want to cancel?",
  invalid = "Please fill in all required form inputs.",
  delete = "Are you sure you want to delete",
}

export interface BasicPopupProps {
  text: string;
  action?: () => void;
}

export interface PopupProps extends BasicPopupProps {
  close: () => void;
}

export const Popup: React.FC<PopupProps> = ({
  text,
  close,
  action,
}) => {
  return (
    <div>
      <Overlay zIndex={OverlayZIndex.Popup} onClick={close} />
      <div className={styles.popup}>
        <div className={styles.message}>
          {text}
        </div>
        <div>
          {text === PopupMessage.changes || text.includes(PopupMessage.delete)
            ? (
              <>
                <button className={styles.button} onClick={close}>No</button>
                <button className={styles.button} onClick={action} autoFocus={true}>Yes</button>
              </>
            ) : <button className={styles.button} onClick={close} autoFocus={true}>Ok</button>
          }
        </div>
      </div>
    </div>
  );
};
