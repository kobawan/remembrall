import * as React from "react";
import { MutationFn } from "react-apollo";
import { logErrors } from "../../utils/errorHandling";
import { Column } from "../Column/Column";
import { ColumnType, CommonFields } from "../../types";
import { MaterialWrapper, MaterialRenderProps } from "./MaterialWrapper";

interface MaterialColumnProps {
	safeDeleteTicket: (data: CommonFields, deleteFn: MutationFn<any, any>) => void;
}

export class MaterialColumn extends React.Component<MaterialColumnProps> {
	public shouldComponentUpdate() {
		return false;
	}

	public render() {
		const { safeDeleteTicket } = this.props;
		return (
			<MaterialWrapper>
				{({ addMaterial, updateMaterial, deleteMaterial, materials: { data, error }}: MaterialRenderProps) => {
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
	}
}
