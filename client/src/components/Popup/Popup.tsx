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

export class Popup extends React.PureComponent<PopupProps> {
  public render () {
    const { text } = this.props;
    return (
      <div>
        <Overlay zIndex={OverlayZIndex.Popup}/>
        <div className={styles.popup}>
          <div className={styles.message}>
            {text}
          </div>
          <div>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }

  private renderButtons = () => {
    const { text, close, action } = this.props;

    if(text === PopupMessage.changes || text.includes(PopupMessage.delete)) {
      return <>
        <button className={styles.button} onClick={close}>No</button>
        <button className={styles.button} onClick={action} autoFocus={true}>Yes</button>
      </>;
    }

    return <button className={styles.button} onClick={close} autoFocus={true}>Ok</button>;
  }
}
