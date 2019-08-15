import React, { useState } from "react";
import { MutationFunction } from "react-apollo";
import { CommonFields, CategoryFields } from "../../types";
import { FormTitle } from "../Form/FormTitle";
import { Form, FormSize } from "../Form/Form";
import { AddCategoryData, CategoryInput, UpdateCategoryData } from "../CategoryColumn/CategoryWrapper";
import { formHasChanges, submitForm } from "../Form/formUtils";

interface FormProps {
  ticket?: CategoryFields;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
  createTicket: MutationFunction<AddCategoryData, CategoryInput>;
  deleteTicket: (data: CommonFields) => void;
  updateTicket: MutationFunction<UpdateCategoryData, CategoryInput & { id: string }>;
}

enum Fields {
  name = "name",
}

const requiredFields = [Fields.name];

export const CategoryForm: React.FC<FormProps> = ({
  closeForm,
  openInvalidPopup,
  openChangesPopup,
  createTicket,
  updateTicket,
  ticket,
}) => {
  const [name, setName] = useState(ticket ? ticket.name : "");

  const submitCategory = () => {
    submitForm({
      requiredFields,
      stateTicket: { name: name.toLowerCase() },
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
      value={name}
      onChange={(e) => setName(e.currentTarget.value)}
      placeholder="Category name"
    />
  );

  return (
    <Form
      Title={Title}
      Content={null}
      submitForm={submitCategory}
      size={FormSize.small}
      formHasChangesFn={() => formHasChanges({ name: name.toLowerCase() }, ticket)}
      openChangesPopup={openChangesPopup}
      closeForm={closeForm}
    />
  );
};
