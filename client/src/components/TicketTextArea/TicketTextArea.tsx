import * as React from "react";
import { MutationFunction } from "react-apollo";
import "./ticketTextArea.less";
import { TicketData, ColumnType } from "../../types";

interface TicketTextAreaProps {
  data: TicketData;
  type: ColumnType;
  updateTicket: MutationFunction<any, { id: string, params: any }>;
  close: () => void;
  toggleError: (toggleError: boolean) => void;
}

interface TicketTextAreaState {
  value: string;
}

export class TicketTextArea extends React.Component<TicketTextAreaProps, TicketTextAreaState> {
  public state: TicketTextAreaState = {
    value: this.props.data.name,
  };

  public render() {
    const { value } = this.state;
    return (
      <textarea
        onChange={this.handleInput}
        onKeyDown={this.handleKeyDown}
        onBlur={this.submitChange}
        value={value}
        placeholder="Name"
        className="ticketEditer"
        autoFocus={true}
      />
    );
  }

  /**
	 * Updates textarea input
	 */
  private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.toggleError(false);
    this.setState({ value: e.currentTarget.value });
  }

  /**
	 * Updates ticket name on enter
	 */
  private handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // enter
    if(e.keyCode === 13) {
      e.preventDefault();
      this.submitChange();
    }
  }

  /**
	 * Updates the ticket's name
	 */
  private submitChange = async () => {
    const { data, close, type } = this.props;
    const { value } = this.state;

    if(!value.length) {
      this.props.toggleError(true);
      return;
    }

    /**
		 * @todo show error on incompatible naming
		 */
    if(data.name !== value) {
      await this.props.updateTicket({
        variables: {
          id: data.id,
          params: { name: type === ColumnType.Projects ? value : value.toLowerCase() },
        },
      });
    }
    close();
  }
}
