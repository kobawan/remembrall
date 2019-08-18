import React, { useReducer } from "react";
import { MutationFunction } from "react-apollo";
import { CommonFields, ProjectFields } from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { RowInputWithList } from "../Form/RowInputWithList";
import { logErrors } from "../../utils/errorHandling";
import { useCategoryQueryAndAddMutation } from "../CategoryColumn/CategoryWrapper";
import { useToolQueryAndAddMutation } from "../ToolColumn/ToolWrapper";
import { useMaterialQueryAndAddMutation } from "../MaterialColumn/MaterialWrapper";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { RowTextArea } from "../Form/RowTextArea";
import {
  UpdateProjectData,
  AddProjectData,
  ProjectInput,
} from "../ProjectColumn/ProjectWrapper";
import { Form, FormSize } from "../Form/Form";
import { formHasChanges, submitForm } from "../Form/formUtils";
import { ProjectReducerType, projectReducer, initialProjectState, ProjectState } from "./reducer";
import { updateProjectFieldAction } from "./actions";

interface FormProps {
  ticket?: ProjectFields;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
  createTicket: MutationFunction<AddProjectData, ProjectInput>;
  deleteTicket: (data: CommonFields) => void;
  updateTicket: MutationFunction<UpdateProjectData, ProjectInput & { id: string }>;
}

enum Fields {
  name = "name",
  categories = "categories",
  tools = "tools",
  materials = "materials",
  notes = "notes",
  instructions = "instructions",
}

const requiredFields = [
  Fields.name,
  Fields.categories,
  Fields.tools,
  Fields.materials,
];

export const displayedFields = requiredFields;

export const ProjectForm: React.FC<FormProps> = ({
  closeForm,
  openInvalidPopup,
  openChangesPopup,
  createTicket,
  updateTicket,
  ticket,
  deleteTicket,
}) => {
  const [ state, dispatch ] = useReducer<ProjectReducerType>(
    projectReducer,
    getInitialState(initialProjectState, ticket),
  );
  const [categoryRes, [addCategory, addCategoryRes]] = useCategoryQueryAndAddMutation();
  const [toolRes, [addTool, addToolRes]] = useToolQueryAndAddMutation();
  const [materialRes, [addMaterial, addMaterialRes]] = useMaterialQueryAndAddMutation();

  const categories = categoryRes.data && categoryRes.data.categories ? categoryRes.data.categories : [];
  const materials = materialRes.data && materialRes.data.materials ? materialRes.data.materials : [];
  const tools = toolRes.data && toolRes.data.tools ? toolRes.data.tools : [];

  logErrors(
    materialRes.error,
    addMaterialRes.error,
    categoryRes.error,
    addCategoryRes.error,
    toolRes.error,
    addToolRes.error,
  );

  const updateField: OnChangeFn = (e) => {
    updateProjectFieldAction(dispatch, {
      key: e.currentTarget.name as keyof ProjectState,
      value: e.currentTarget.value,
    });
  };
  const updateTags = (field: string, tags: CommonFields[]) => {
    updateProjectFieldAction(dispatch, { key: field as keyof ProjectState, value: tags });
  };

  const submitProject = async () => {
    await submitForm({
      requiredFields,
      stateTicket: state,
      dbTicket: ticket,
      openInvalidPopup,
      updateTicket: updateTicket as MutationFunction,
      createTicket: createTicket as MutationFunction,
      closeForm,
    });
  };

  const Title = (
    <FormTitle
      name={Fields.name}
      value={state.name}
      onChange={updateField}
      placeholder="Project name"
      size={FormSize.large}
    />
  );

  const Content = (
    <>
      <RowInputWithList
        name={Fields.categories}
        tags={state.categories}
        options={categories}
        addOption={addCategory}
        isRequired={true}
        updateTags={updateTags}
      />
      <RowInputWithList
        name={Fields.tools}
        tags={state.tools}
        options={tools}
        addOption={addTool}
        isRequired={true}
        updateTags={updateTags}
      />
      <RowInputWithList
        name={Fields.materials}
        tags={state.materials}
        options={materials}
        addOption={addMaterial}
        isRequired={true}
        updateTags={updateTags}
      />
      <RowTextArea
        name={Fields.instructions}
        value={state.instructions}
        onChange={updateField}
      />
      <RowTextArea
        name={Fields.notes}
        value={state.notes}
        onChange={updateField}
      />
    </>
  );

  return (
    <Form
      Title={Title}
      Content={Content}
      submitForm={submitProject}
      size={FormSize.large}
      formHasChangesFn={() => formHasChanges(state, ticket)}
      openChangesPopup={openChangesPopup}
      closeForm={closeForm}
      deleteTicket={deleteTicket}
      ticket={ticket}
    />
  );
};
