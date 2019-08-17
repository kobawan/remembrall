import React from "react";
import { MutationFunction } from "react-apollo";
import isEqual from "lodash.isequal";
import cx from "classnames";
import * as styles from "./ticket.less";
import { ColumnType, AllColumnFields, CommonFields } from "../../types";
import { TicketTextArea } from "../TicketTextArea/TicketTextArea";
import { TicketDisplay, DisplayDirection } from "../TicketDisplay/TicketDisplay";
import { FormManagerState } from "../ColumnsManager/types";

export interface TicketProps {
  type: ColumnType;
  openForm: (props: FormManagerState) => void;
  data: AllColumnFields;
  displayFields: string[];
  focused: boolean;
  updateTicket: MutationFunction<any, { id: string, params: any }>;
  deleteTicket: (data: CommonFields) => void;
  displayDirection: DisplayDirection;
}

interface TicketState {
  focused: boolean;
  withError: boolean;
}

export class Ticket extends React.Component<TicketProps, TicketState> {
  public state: TicketState = {
    focused: this.props.focused,
    withError: false,
  };

  public shouldComponentUpdate(nextProps: TicketProps, nextState: TicketState) {
    return !isEqual(this.props.data, nextProps.data) || !isEqual(this.state, nextState);
  }

  public render() {
    const { focused, withError } = this.state;
    const {
      data,
      openForm,
      deleteTicket,
      updateTicket,
      type,
      displayFields,
      displayDirection,
    } = this.props;

    return (<>
      <div className={cx(styles.ticket, withError && styles.error)}>
        {!focused && data
          ? (
            <TicketDisplay
              data={data}
              openForm={openForm}
              deleteTicket={deleteTicket}
              openTextArea={this.toggleTextArea}
              displayFields={displayFields}
              displayDirection={displayDirection}
              type={type}
            />
          ) : (
            <TicketTextArea
              data={data}
              key={name}
              type={type}
              updateTicket={updateTicket}
              close={this.toggleTextArea}
              toggleError={this.toggleError}
            />
          )
        }
      </div>
    </>);
  }

  /**
	 * Show ticket with red border error
	 */
  private toggleError = (withError: boolean) => {
    this.setState({ withError });
  }

  /**
	 * Toggles the textarea element for editing
	 */
  private toggleTextArea = () => {
    this.setState({ focused: !this.state.focused });
  }
}
