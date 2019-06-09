import * as React from "react";
import "./popup.less";
import { Overlay } from "../Overlay/Overlay";

export enum PopupMessage {
  changes = "Are you sure you want to cancel?",
  invalid = "Please fill in all required form inputs.",
  delete = "Are you sure you want to delete",
}

export interface PopupProps {
  text: string;
  close: () => void;
  action?: () => void;
}

export class Popup extends React.PureComponent<PopupProps> {
  public render () {
    return (
      <div>
        <Overlay zIndex={98}/>
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
    const { text, close, action } = this.props;

    if(text === PopupMessage.changes || text.includes(PopupMessage.delete)) {
      return <>
        <button className="popupButton" onClick={close}>No</button>
        <button className="popupButton" onClick={action}>Yes</button>
      </>;
    }

    return <button className="popupButton" onClick={close}>Ok</button>;
  }
}
