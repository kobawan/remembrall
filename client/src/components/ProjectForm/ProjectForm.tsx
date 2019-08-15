import React, { useReducer } from "react";
import { MutationFn } from "react-apollo";
import { CommonFields, ProjectFields } from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { RowInputWithList } from "../Form/RowInputWithList";
import { logErrors } from "../../utils/errorHandling";
import { CategoryWrapper, CategoryRenderProps } from "../CategoryColumn/CategoryWrapper";
import { ToolWrapper, ToolRenderProps } from "../ToolColumn/ToolWrapper";
import { MaterialWrapper, MaterialRenderProps } from "../MaterialColumn/MaterialWrapper";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { RowTextArea } from "../Form/RowTextArea";
import { UpdateProjectData, AddProjectData, ProjectInput } from "../ProjectColumn/ProjectWrapper";
import { Form, FormSize } from "../Form/Form";
import { formHasChanges, submitForm } from "../Form/formUtils";
import { ProjectReducerType, projectReducer, initialProjectState, ProjectState } from "./reducer";
import { updateProjectFieldAction } from "./actions";

interface FormProps {
  ticket?: ProjectFields;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
  createTicket: MutationFn<AddProjectData, ProjectInput>;
  deleteTicket: (data: CommonFields) => void; // @todo add delete button to form
  updateTicket: MutationFn<UpdateProjectData, ProjectInput & { id: string }>;
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

export const ProjectForm: React.FC<FormProps> = ({
  closeForm,
  openInvalidPopup,
  openChangesPopup,
  createTicket,
  updateTicket,
  ticket,
}) => {
  const [ state, dispatch ] = useReducer<ProjectReducerType>(
    projectReducer,
    getInitialState(initialProjectState, ticket),
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

  const submitProject = () => {
    submitForm({
      requiredFields,
      stateTicket: state,
      dbTicket: ticket,
      openInvalidPopup,
      updateTicket: updateTicket as MutationFn,
      createTicket: createTicket as MutationFn,
      closeForm,
    });
  };

  const Title = (
    <FormTitle
      name={Fields.name}
      value={state.name}
      onChange={updateField}
      placeholder="Project name"
    />
  );

  const Content = (
    <>
      <CategoryWrapper>
        {({ addCategory, categories: { data, error }}: CategoryRenderProps) => {
          logErrors(error, addCategory);
          return (
            <RowInputWithList
              name={Fields.categories}
              tags={state.categories}
              options={data && data.categories ? data.categories : []}
              addOption={addCategory.mutation}
              isRequired={true}
              updateTags={updateTags}
            />
          );
        }}
      </CategoryWrapper>
      <ToolWrapper>
        {({ addTool, tools: { data, error }}: ToolRenderProps) => {
          logErrors(error, addTool);
          return (
            <RowInputWithList
              name={Fields.tools}
              tags={state.tools}
              options={data && data.tools ? data.tools : []}
              addOption={addTool.mutation}
              isRequired={true}
              updateTags={updateTags}
            />
          );
        }}
      </ToolWrapper>
      <MaterialWrapper>
        {({ addMaterial, materials: { data, error }}: MaterialRenderProps) => {
          logErrors(error, addMaterial);
          return (
            <RowInputWithList
              name={Fields.materials}
              tags={state.materials}
              options={data && data.materials ? data.materials : []}
              addOption={addMaterial.mutation}
              isRequired={true}
              updateTags={updateTags}
            />
          );
        }}
      </MaterialWrapper>
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
    />
  );
};
