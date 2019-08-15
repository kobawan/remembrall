import isEqual from "lodash.isequal";
import { MutationFn } from "react-apollo";
import { AllColumnFields } from "../../types";

export const formHasChanges = (stateTicket: {}, dbTicket?: { [key: string]: any }) => {
  const defaultTicket = { id: undefined, __typename: undefined };
  const { id, __typename, ...ticket} = dbTicket || defaultTicket;

  if (!Object.keys(ticket).length) {
    return Object.entries<any>(stateTicket).some(([ _, value ]) => {
      return (
        (typeof value === "string" || Array.isArray(value)) && !!value.length
        || (typeof value === "number") && value !== 1
      );
    });
  }

  return !isEqual(stateTicket, ticket);
};

/**
 * Checks that the required fields are filled in
 */
export const formIsValid = (requiredFields: string[], stateTicket: { [key: string]: any }) => {
  return requiredFields.some((field) => {
    if(!stateTicket.hasOwnProperty(field)) {
      return false;
    }

    const value = stateTicket[field];
    return (
      (typeof value === "string" || Array.isArray(value))
      && !!value.length
    );
  });
};

interface SubmitFormProps {
  requiredFields: string[];
  stateTicket: {};
  dbTicket?: AllColumnFields;
  openInvalidPopup: () => void;
  updateTicket: MutationFn;
  createTicket: MutationFn;
  closeForm: () => void;
}

export const submitForm = ({
  requiredFields,
  stateTicket,
  dbTicket,
  openInvalidPopup,
  updateTicket,
  createTicket,
  closeForm,
}: SubmitFormProps) => {
  if(!formIsValid(requiredFields, stateTicket)) {
    openInvalidPopup();
    return;
  }

  if(formHasChanges(stateTicket, dbTicket)) {
    const paramEntries = Object.entries<any>(stateTicket).map(([ key, value ]) => {
      if(Array.isArray(value)) {
        return [key, value.map(tag => tag.id)];
      }
      return [key, value];
    });
    const params = Object.fromEntries(paramEntries);

    if(dbTicket) {
      updateTicket({ variables: { params, id: dbTicket.id } });
    } else {
      createTicket({ variables: { params } });
    }
  }

  closeForm();
};