import React, { useReducer } from "react";
import { MutationFunction } from "react-apollo";
import {
  CommonFields,
  ProjectFields,
  ProjectFieldWithAmountUsed,
  CategoryFields,
  ToolFields,
  MaterialFields,
} from "../../types";
import { getInitialState } from "../../utils/getInitialState";
import { RowTagsListWithAmount } from "../Form/RowTagsListWithAmount";
import { RowTagsList } from "../Form/RowTagsList";
import { logErrors } from "../../utils/errorHandling";
import { useCategoryQuery } from "../CategoryColumn/CategoryWrapper";
import { useToolQuery } from "../ToolColumn/ToolWrapper";
import { useMaterialQuery } from "../MaterialColumn/MaterialWrapper";
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

const displayedToolFields: (keyof ToolFields)[] = ["name", "type", "size"];
const displayedMaterialFields: (keyof MaterialFields)[] = ["name", "color"];

export const displayedFields: (string | Record<string, string[]>)[] = [
  Fields.name,
  Fields.categories,
  { [Fields.tools]: displayedToolFields },
  { [Fields.materials]: displayedMaterialFields },
];

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
  const categoryRes = useCategoryQuery();
  const toolRes = useToolQuery();
  const materialRes = useMaterialQuery();

  const categories = categoryRes.data && categoryRes.data.categories ? categoryRes.data.categories : [];
  const materials = materialRes.data && materialRes.data.materials ? materialRes.data.materials : [];
  const tools = toolRes.data && toolRes.data.tools ? toolRes.data.tools : [];

  // @todo take current form tags into consideration
  const availableMaterials = materials.reduce((res: MaterialFields[], material) => {
    if(material.availableAmount < 1) {
      return res;
    }
    const stateMaterial = state.materials.find(({ entry }) => entry.id === material.id);
    if(stateMaterial) {
      return stateMaterial.entry.availableAmount - stateMaterial.amountUsed < 1
        ? res
        : res.concat([stateMaterial.entry]);
    }
    return res.concat([material]);
  }, []);
  const availableTools = tools.filter(({ availableAmount }) => availableAmount > 0);

  logErrors(
    materialRes.error,
    categoryRes.error,
    toolRes.error,
  );

  const updateField: OnChangeFn = (e) => {
    updateProjectFieldAction(dispatch, {
      key: e.currentTarget.name as keyof ProjectState,
      value: e.currentTarget.value,
    });
  };
  const updateCategoryTags = (tags: CategoryFields[]) => {
    updateProjectFieldAction(dispatch, { key: Fields.categories, value: tags });
  };
  const updateMaterialTags = (tags: ProjectFieldWithAmountUsed<MaterialFields>[]) => {
    updateProjectFieldAction(dispatch, { key: Fields.materials, value: tags });
  };
  const updateToolTags = (tags: ProjectFieldWithAmountUsed<ToolFields>[]) => {
    updateProjectFieldAction(dispatch, { key: Fields.tools, value: tags });
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
      <RowTagsList
        name={Fields.categories}
        tags={state.categories}
        options={categories}
        isRequired={true}
        updateTags={updateCategoryTags}
        displayedFields={["name"]}
      />
      <RowTagsListWithAmount
        name={Fields.tools}
        tags={state.tools}
        options={availableTools}
        isRequired={true}
        updateTags={updateToolTags}
        displayedFields={displayedToolFields}
      />
      <RowTagsListWithAmount
        name={Fields.materials}
        tags={state.materials}
        options={availableMaterials}
        isRequired={true}
        updateTags={updateMaterialTags}
        displayedFields={displayedMaterialFields}
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
