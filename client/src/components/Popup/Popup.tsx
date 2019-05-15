import * as React from "react";
import "./popup.less";
import { Overlay } from "../Overlay/Overlay";

export enum PopupMessage {
  changes = "Are you sure you want to cancel?",
  invalid = "Please fill in all required form inputs.",
}

export interface PopupProps {
  text: string;
  close: () => void;
  cancel: () => void;
}

export class Popup extends React.PureComponent<PopupProps> {
  public render () {
    return (
      <div>
        <Overlay />
        <div className="popup">
          <div className="message">
            {this.props.text}
          </div>
          <div>
            {this.renderButtons()}
          </div>
        </div>
      </div>
    );
  }

  private renderButtons = () => {
    const { text, close, cancel } = this.props;
    switch(text) {
      case PopupMessage.changes: {
        return <>
          <button className="popupButton" onClick={close}>No</button>
          <button className="popupButton" onClick={cancel}>Yes</button>
        </>;
      }
      default: {
        return <button className="popupButton" onClick={close}>Ok</button>;
      }
    }
  }
}
