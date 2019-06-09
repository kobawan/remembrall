import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { ProjectFields, CommonFields, MutationRenderProps, AdoptInputProps } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_MATERIALS, ADD_MATERIAL } from "../../queries/queries";

type GetMaterialData = Pick<ProjectFields, "materials">;
interface AddMaterialData {
	addMaterial: CommonFields;
}
interface MaterialInput {
	params: { name: string, amount?: number, color?: string };
}
export interface MaterialRenderProps {
	materials: QueryResult<GetMaterialData>;
	addMaterial: MutationRenderProps<AddMaterialData, MaterialInput>;
}
const addToCache: MutationUpdaterFn<AddMaterialData> =
	initHandleCache<AddMaterialData, GetMaterialData>(GET_MATERIALS, (res, data) => {
		if(!res.materials) {
			res.materials = [];
		}
		res.materials.push(data.addMaterial);
		return res;
	});

const components: AdoptInputProps<MaterialRenderProps> = {
	materials: ({ render }) => (
		<Query query={GET_MATERIALS} children={render} />
	),
	addMaterial: ({ render }) => (
		<Mutation mutation={ADD_MATERIAL} update={addToCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
};

export const MaterialWrapper = adopt<MaterialRenderProps>(components);
