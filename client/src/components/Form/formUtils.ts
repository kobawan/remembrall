import isEqual from "lodash.isequal";
import { MutationFunction } from "react-apollo";
import { AllColumnFields, TempAnyObject } from "../../types";

export const formHasChanges = (stateTicket: TempAnyObject, dbTicket?: TempAnyObject) => {
  const defaultTicket = { id: undefined, __typename: undefined };
  const { id, __typename, inProjects, ...ticket} = dbTicket || defaultTicket;

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
 * Checks if the required fields are filled in
 */
export const formIsInvalid = (requiredFields: string[], stateTicket: TempAnyObject) => {
  return requiredFields.some((field) => {
    if(!stateTicket.hasOwnProperty(field)) {
      throw new Error(`${field} is not a property of state.`);
    }

    const value = stateTicket[field];
    return (
      (typeof value === "string" || Array.isArray(value)) && !value.length
      || value === undefined
      || value === null
    );
  });
};

interface SubmitFormProps {
  requiredFields: string[];
  stateTicket: TempAnyObject;
  dbTicket?: AllColumnFields;
  openInvalidPopup: () => void;
  updateTicket: MutationFunction;
  createTicket: MutationFunction;
  closeForm: () => void;
}

export const submitForm = async ({
  requiredFields,
  stateTicket,
  dbTicket,
  openInvalidPopup,
  updateTicket,
  createTicket,
  closeForm,
}: SubmitFormProps) => {
  if(formIsInvalid(requiredFields, stateTicket)) {
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
      await updateTicket({ variables: { params, id: dbTicket.id } });
    } else {
      await createTicket({ variables: { params } });
    }
  }

  closeForm();
};