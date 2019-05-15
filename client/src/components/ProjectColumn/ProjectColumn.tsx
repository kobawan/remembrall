import * as React from "react";
import { Column } from "../Column/Column";
import { ColumnType, ProjectFields } from "../../types";
import { logErrors } from "../../utils/errorHandling";
import { Overlay } from "../Overlay/Overlay";
import { ProjectForm } from "../ProjectForm/ProjectForm";
import { ProjectWrapper, ProjectRenderProps } from "./ProjectWrapper";
import { Popup, PopupMessage } from "../Modal/Popup";

interface ColumnState {
	formOpened: boolean;
	formHasChanges: () => boolean;
	formProps?: ProjectFields;
	popupText?: string;
}

export class ProjectColumn extends React.PureComponent<{}, ColumnState> {
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
								deleteTicket={deleteProject.mutation}
								updateTicket={updateProject.mutation}
							/>
						</>}
						{popupText && (
							<Popup
								text={popupText}
								close={this.closePopup}
								cancel={this.cancelFormChanges}
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

	private openPopup = (popupText: PopupMessage) => {
		this.setState({ popupText });
	}

	private closePopup = () => {
		this.setState({ popupText: undefined });
	}

	/**
	 * Closes both the popup and the form even if it has changes
	 */
	private cancelFormChanges = () => {
		this.closePopup();
		this.closeForm();
	}
}
