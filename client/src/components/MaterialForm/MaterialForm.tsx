import React, { useReducer } from "react";
import { MutationFn } from "react-apollo";
import { CommonFields, MaterialFields } from "../../types";
import { OnChangeFn } from "../Form/types";
import { FormTitle } from "../Form/FormTitle";
import { Form, FormSize } from "../Form/Form";
import { RowInput } from "../Form/RowInput";
import { AddMaterialData, MaterialInput, UpdateMaterialData } from "../MaterialColumn/MaterialWrapper";
import { getInitialState } from "../../utils/getInitialState";
import { updateMaterialFieldAction } from "./actions";
import { MaterialState, materialReducer, MaterialReducerType, initialMaterialState } from "./reducer";
import { formHasChanges, submitForm } from "../Form/formUtils";

interface FormProps {
	ticket?: MaterialFields;
	closeForm: () => void;
	openInvalidPopup: () => void;
	openChangesPopup: () => void;
	createTicket: MutationFn<AddMaterialData, MaterialInput>;
	deleteTicket: (data: CommonFields) => void;
	updateTicket: MutationFn<UpdateMaterialData, MaterialInput & { id: string }>;
}

enum Fields {
	name = "name",
	amount = "amount",
	color = "color",
}

const requiredFields = [Fields.name];

const convertToDbTicket = (state: MaterialState) => ({
	amount: state.amount,
	name: state.name.toLowerCase(),
	color: state.color,
});

export const MaterialForm: React.FC<FormProps> = ({
	ticket,
	openChangesPopup,
	closeForm,
	openInvalidPopup,
	updateTicket,
	createTicket,
}) => {
	const [ state, dispatch ] = useReducer<MaterialReducerType>(
		materialReducer,
		getInitialState(initialMaterialState, ticket),
	);

	const updateField: OnChangeFn = (e) => {
		updateMaterialFieldAction(dispatch, {
			key: e.currentTarget.name as keyof MaterialState,
			value: e.currentTarget.value,
		});
	};
	const updateNumberField: OnChangeFn = (e) => {
		updateMaterialFieldAction(dispatch, {
			key: e.currentTarget.name as keyof MaterialState,
			value: +e.currentTarget.value,
		});
	};

	const submitMaterial = () => {
		submitForm({
			requiredFields,
			stateTicket: convertToDbTicket(state),
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
			placeholder="Material name"
		/>
	);

	const Content = (
		<>
			<RowInput
				name={Fields.color}
				value={state.color || ""}
				onChange={updateField}
			/>
			<RowInput
				name={Fields.amount}
				value={`${state.amount}`}
				type="number"
				onChange={updateNumberField}
			/>
		</>
	);

	return(
		<Form
			Title={Title}
			Content={Content}
			submitForm={submitMaterial}
			size={FormSize.small}
			formHasChangesFn={() => formHasChanges(convertToDbTicket(state), ticket)}
			openChangesPopup={openChangesPopup}
			closeForm={closeForm}
		/>
	);
};
