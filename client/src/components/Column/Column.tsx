import * as React from "react";
import "./column.less";
import { Ticket, TicketProps } from "../Ticket/Ticket";
import { ColumnType, AllColumnFields } from "../../types";
import { plusSvg } from "../Svg/Svg";

interface ColumnProps {
    type: ColumnType;
    ticketData: AllColumnFields[];
}

interface ColumnState {
    tickets: TicketProps[];
}

export class Column extends React.Component<ColumnProps, ColumnState> {
    public state: ColumnState = {
        /**
         * @todo get tickets from graphQL
         */
        tickets: [],
    };

    public render() {
        const type = this.props.type;

        return (
            <div className="column">
                <div className="header" onClick={this.handleClick}>
                    <span>{type}</span>
                    {plusSvg}
                </div>
                <div className="content">
                    {this.renderTickets()}
                </div>
            </div>
        );
    }

    private handleClick = () => {
        this.setState({
            tickets: [
                ...this.state.tickets,
                {
                    inEditMode: true,
                    deleteTicket: this.deleteTicket,
                    /**
                     * @todo get ID from graphQL
                     */
                    id: Math.floor(Math.random() * Math.pow(10, 12)),
                },
            ],
        });
    }

    private renderTickets = () => {
        return this.state.tickets.map((props, index) => {
            return <Ticket {...props} key={index} />;
        });
    }

    private deleteTicket = (id: number) => {
        const tickets = this.state.tickets.filter(ticket => ticket.id !== id);
        this.setState({ tickets });
    }
}
