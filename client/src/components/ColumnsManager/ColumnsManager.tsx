import * as React from "react";
import "./columnsManager.less";
import { ProjectColumn } from "../ProjectColumn/ProjectColumn";
import { CategoryColumn } from "../CategoryColumn/CategoryColumn";
import { Popup, PopupMessage } from "../Popup/Popup";
import { MutationFn } from "react-apollo";
import { CommonFields, TicketData } from "../../types";
import { ToolColumn } from "../ToolColumn/ToolColumn";
import { MaterialColumn } from "../MaterialColumn/MaterialColumn";

interface ColumnsState {
	popupText?: string;
	popupAction?: () => void;
	formOpened: boolean;
	formProps?: TicketData;
	formHasChanges: () => boolean;
	ticketToDelete?: CommonFields;
}

export class ColumnsManager extends React.Component<{}, ColumnsState> {
	public state: ColumnsState = {
		formOpened: false,
		formHasChanges: () => false,
	};

	public render() {
		const {
			popupText,
			popupAction,
			formOpened,
			formProps,
		} = this.state;

		return (
			<div className="columnsContainer">
				<ProjectColumn
					safeDeleteTicket={this.safeDeleteTicket}
					openForm={this.openForm}
					formOpened={formOpened}
					formProps={formProps}
					closeForm={this.closeForm}
					setFormHasChangesFn={this.setFormHasChangesFn}
					safeCloseForm={this.safeCloseForm}
					openInvalidPopup={this.openInvalidPopup}
				/>
				<CategoryColumn safeDeleteTicket={this.safeDeleteTicket} />
				<ToolColumn safeDeleteTicket={this.safeDeleteTicket} />
				<MaterialColumn safeDeleteTicket={this.safeDeleteTicket} />
				{popupText && (
					<Popup
						text={popupText}
						close={this.closePopup}
						action={popupAction}
					/>
				)}
			</div>
		);
	}

	private closePopup = () => {
		this.setState({
			popupText: undefined,
			popupAction: undefined,
		});
	}

	private openPopup = (popupText: string, popupAction?: () => void) => {
		this.setState({
			popupText,
			popupAction,
		});
	}

	/**
	 * Popup for cancelling form changes
	 */
	private openChangesPopup = () => {
		this.openPopup(PopupMessage.changes, this.closeAll);
	}

	/**
	 * Popup for submitting form with invalid values
	 */
	private openInvalidPopup = () => {
		this.openPopup(PopupMessage.invalid);
	}

	/**
	 * Popup to delete ticket
	 */
	private openDeletePopup = (message: string, deleteFn: MutationFn<any, any>) => {
		this.openPopup(message, () => {
			const { ticketToDelete } = this.state;
			this.closeAll();
			if(ticketToDelete) {
				deleteFn({ variables: ticketToDelete }).then(() => {
					this.setState({ ticketToDelete: undefined });
				});
			}
		});
	}

	/**
	 * Closes the form
	 */
	private closeForm = () => {
		this.setState({
			formOpened: false,
			formProps: undefined,
		});
	}

	/**
	 * Passes ticket props to form on open
	 */
	private openForm = (props?: TicketData) => {
		this.setState({
			formOpened: true,
			formProps: props,
		});
	}

	/**
	 * Allows checking for changes from the form to be able to safely close it
	 */
	private setFormHasChangesFn = (fn: () => boolean) => {
		this.setState({ formHasChanges: fn });
	}

	/**
	 * Checks if form has changes, so it can close it.
	 */
	private safeCloseForm = () => {
		if(this.state.formHasChanges()) {
			this.openChangesPopup();
		} else {
			this.closeForm();
		}
	}

	/**
	 * Opens popup to confirm before deleting ticket
	 */
	private safeDeleteTicket = (data: CommonFields, deleteFn: MutationFn<any, any>) => {
		this.setState({ ticketToDelete: data });
		this.openDeletePopup(`${PopupMessage.delete} "${data.name}"?`, deleteFn);
	}

	/**
	 * Closes both the popup and the form even if it has changes
	 */
	private closeAll = () => {
		this.closePopup();
		this.closeForm();
	}
}
