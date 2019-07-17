import React from "react";
import { MutationFn } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { MaterialWrapper, DeleteMaterialData } from "./MaterialWrapper";

interface MaterialColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<DeleteMaterialData, { id: string }>) => void;
}

export const MaterialColumn = React.memo(({ safeDeleteTicket }: MaterialColumnProps) => {
	return (
		<MaterialWrapper>
			{({ addMaterial, updateMaterial, deleteMaterial, materials: { data, error }}) => {
				logErrors(error, addMaterial, updateMaterial, deleteMaterial);

				return (
					<Column
						tickets={data && data.materials ? data.materials : []}
						type={ColumnType.Materials}
						updateTicket={updateMaterial.mutation}
						createTicket={addMaterial.mutation}
						deleteTicket={(data: CommonFields) => safeDeleteTicket(data, deleteMaterial.mutation)}
					/>
				);
			}}
		</MaterialWrapper>
	);
});
