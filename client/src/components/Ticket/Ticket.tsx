import * as React from "react";
import "./ticket.less";
import { editSvg } from "../Svg/Svg";
import { FormOverlay } from "../FormOverlay/FormOverlay";

export interface TicketProps {
    id: number;
    inEditMode: boolean;
    deleteTicket: (id: number) => void;
}

interface TicketState {
    name: string;
    focused: boolean;
    formOpened: boolean;
}

export class Ticket extends React.PureComponent<TicketProps, TicketState> {
    public state: TicketState = {
        /**
         * @todo get name from GraphQL
         */
        name: "",
        focused: this.props.inEditMode,
        formOpened: false,
    };
    private textAreaRef = React.createRef<HTMLTextAreaElement>();

    public componentDidMount() {
        if (this.props.inEditMode && this.textAreaRef.current) {
            this.textAreaRef.current.focus();
        }
    }

    public render() {
        const { name, focused, formOpened } = this.state;

        return (<>
            <div className="ticket">
                {focused
                    ? <textarea
                        ref={this.textAreaRef}
                        onChange={this.handleInput}
                        onBlur={this.handleBlur}
                        value={name}
                        placeholder="Name of the project"
                    /> : <>
                        <span onClick={this.toggleForm}>
                            {name}
                        </span>
                        <div className="editWrapper" onClick={this.handleFocus} >
                            {editSvg}
                        </div>
                    </>
                }
            </div>
            {formOpened && <FormOverlay closeForm={this.toggleForm}/>}
        </>);
    }

    private toggleForm = () => {
        this.setState({ formOpened: !this.state.formOpened });
    }

    private handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ name: e.target.value });
    }

    private handleFocus = () => {
        this.setState({ focused: true }, () => {
            if (this.textAreaRef.current) {
                this.textAreaRef.current.focus();
            }
        });
    }

    private handleBlur = () => {
        /**
         * @todo only delete ticket if it doesn't have any props
         */
        if(!this.state.name) {
            this.props.deleteTicket(this.props.id);
            return;
        }
        this.setState({ focused: false });
    }
}
