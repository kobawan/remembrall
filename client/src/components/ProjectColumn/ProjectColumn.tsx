import * as React from "react";
import { MutationFn } from "react-apollo";
import { Column } from "../Column/Column";
import { ColumnType, ProjectFields, CommonFields } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { Overlay } from "../Overlay/Overlay";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, ProjectRenderProps } from "./ProjectWrapper";
import { Popup, PopupMessage } from "../Popup/Popup";

interface ColumnState {
	formOpened: boolean;
	formHasChanges: () => boolean;
	formProps?: ProjectFields;
	popupText?: string;
	ticketToDelete?: CommonFields;
}

export class ProjectColumn extends React.Component<{}, ColumnState> {
	public state: ColumnState = {
		formOpened: false,
		formHasChanges: () => false,
	};

	public render() {
		const { formOpened, popupText } = this.state;

		return (
			<ProjectWrapper>
				{({ addProject, deleteProject, updateProject, projects: { data, error }}: ProjectRenderProps) => {
					/**
					 * @todo handle loading?
					 */
					logErrors(error, addProject, deleteProject, updateProject);

					return (<>
						<Column
							tickets={data && data.projects ? data.projects : []}
							type={ColumnType.Projects}
							updateTicket={updateProject.mutation}
							deleteTicket={this.safeDeleteTicket}
							openForm={this.openForm}
						/>
						{formOpened && <>
							<Overlay onClick={this.safeCloseForm} />
							<ProjectForm
								ticket={this.state.formProps}
								closeForm={this.closeForm}
								safeCloseForm={this.safeCloseForm}
								openPopup={this.openPopup}
								setFormHasChangesFn={this.setFormHasChangesFn}
								createTicket={addProject.mutation}
								deleteTicket={this.safeDeleteTicket}
								updateTicket={updateProject.mutation}
							/>
						</>}
						{popupText && (
							<Popup
								text={popupText}
								close={this.closePopup}
								action={popupText === PopupMessage.changes
									? this.closeAll
									: () => this.deleteTicket(deleteProject.mutation)
								}
							/>
						)}
					</>);
				}}
			</ProjectWrapper>
		);
	}

	/**
	 * Allows checking for changes from the form to be able to safely close it
	 */
	private setFormHasChangesFn = (fn: () => boolean) => {
		this.setState({ formHasChanges: fn });
	}

	/**
	 * Passes ticket props to form on open
	 */
	private openForm = (props?: ProjectFields) => {
		this.setState({
			formOpened: true,
			formProps: props,
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
	 * Checks if form has changes, so it can close it.
	 */
	private safeCloseForm = () => {
		if(this.state.formHasChanges()) {
			this.openPopup(PopupMessage.changes);
		} else {
			this.closeForm();
		}
	}

	private openPopup = (popupText: string) => {
		this.setState({ popupText });
	}

	private closePopup = () => {
		this.setState({ popupText: undefined, ticketToDelete: undefined });
	}

	/**
	 * Closes both the popup and the form even if it has changes
	 */
	private closeAll = () => {
		this.closePopup();
		this.closeForm();
	}

	/**
	 * Opens popup to confirm before deleting ticket
	 */
	private safeDeleteTicket = (data: CommonFields) => {
		this.setState({ ticketToDelete: data });
		this.openPopup(`${PopupMessage.delete} "${data.name}?"`);
	}

	/**
	 * Closes popups and forms and deletes ticket
	 */
	private deleteTicket = (deleteFn: MutationFn<any, any>) => {
		const { ticketToDelete } = this.state;
		this.closeAll();
		if(ticketToDelete) {
			deleteFn({ variables: ticketToDelete });
		}
	}
}
