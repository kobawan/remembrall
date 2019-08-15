import React, { useReducer } from "react";
import { MutationFunction } from "react-apollo";
import { ToolFields, CommonFields } from "../../types";
import { AddToolData, UpdateToolData, ToolInput } from "../ToolColumn/ToolWrapper";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { Form, FormSize } from "../Form/Form";
import { RowInput } from "../Form/RowInput";
import { RowInputWithUnit } from "../Form/RowInputWithUnit";
import { Measurements, ToolState, ToolReducerType, toolReducer, initialToolState } from "./reducer";
import { updateToolFieldAction } from "./actions";
import { formHasChanges, submitForm } from "../Form/formUtils";

interface FormProps {
  ticket?: ToolFields;
  closeForm: () => void;
  openInvalidPopup: () => void;
  openChangesPopup: () => void;
  createTicket: MutationFunction<AddToolData, ToolInput>;
  deleteTicket: (data: CommonFields) => void;
  updateTicket: MutationFunction<UpdateToolData, ToolInput & { id: string }>;
}

enum Fields {
  name = "name",
  amount = "amount",
  type = "type",
  size = "size",
  measurement = "measurement",
}

const requiredFields = [Fields.name];

const parseValueAndUnit = (value: string | null) => {
  const [size, measurement] = (value || "").split(";");
  return {
    size: size && size.length ? size : null,
    measurement: measurement && measurement.length ? measurement as Measurements : null,
  };
};

const joinValueAndUnit = (value: string | null, unit: Measurements | null) => {
  if (value === null && unit === null) {
    return null;
  }
  return `${value || ""};${unit || ""}`;
};

const convertToDbTicket = (state: ToolState) => ({
  amount: state.amount,
  name: state.name.toLowerCase(),
  size: joinValueAndUnit(state.size, state.measurement),
  type: state.type,
});

const getToolDefaultState = (defaultState: ToolState, ticket?: ToolFields) => {
  if(!ticket) {
    return defaultState;
  }
  const { name, amount, type, size } = ticket;

  return {
    name,
    type,
    amount: amount === null ? 1 : amount,
    ...parseValueAndUnit(size),
  };
};

export const ToolForm: React.FC<FormProps> = ({
  ticket,
  openChangesPopup,
  closeForm,
  openInvalidPopup,
  updateTicket,
  createTicket,
}) => {
  const [ state, dispatch ] = useReducer<ToolReducerType>(
    toolReducer,
    getToolDefaultState(initialToolState, ticket),
  );

  const updateField: OnChangeFn = (e) => {
    updateToolFieldAction(dispatch, {
      key: e.currentTarget.name as keyof ToolState,
      value: e.currentTarget.value,
    });
  };
  const updateNumberField: OnChangeFn = (e) => {
    updateToolFieldAction(dispatch, {
      key: e.currentTarget.name as keyof ToolState,
      value: +e.currentTarget.value,
    });
  };

  const submitTool = () => {
    submitForm({
      requiredFields,
      stateTicket: convertToDbTicket(state),
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
      placeholder="Tool name"
    />
  );

  const Content = (
    <>
      <RowInput
        name={Fields.type}
        value={state.type || ""}
        onChange={updateField}
      />
      <RowInputWithUnit
        name={Fields.size}
        value={state.size || ""}
        unitValue={state.measurement || Measurements.mm}
        onChange={updateField}
        onUnitChange={updateField}
        type="number"
        options={Object.keys(Measurements)}
      />
      <RowInput
        name={Fields.amount}
        value={`${state.amount}`}
        type="number"
        onChange={updateNumberField}
      />
    </>
  );

  return (
    <Form
      Title={Title}
      Content={Content}
      submitForm={submitTool}
      size={FormSize.medium}
      formHasChangesFn={() => formHasChanges(convertToDbTicket(state), ticket)}
      openChangesPopup={openChangesPopup}
      closeForm={closeForm}
    />
  );
};
