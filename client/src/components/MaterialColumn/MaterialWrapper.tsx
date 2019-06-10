import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query, MutationFn, MutationResult } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { CommonFields, MutationRenderProps, MaterialFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_MATERIALS, ADD_MATERIAL, DELETE_MATERIAL, UPDATE_MATERIAL } from "./materialQueries";

interface GetMaterialData {
	materials?: MaterialFields[];
}

interface AddMaterialData {
	addMaterial: CommonFields;
}

interface UpdateMaterialData {
	updateMaterial: CommonFields;
}

interface DeleteMaterialData {
	deleteMaterial: CommonFields;
}

interface MaterialInput {
	params: { name: string, amount?: number, color?: string };
}
export interface MaterialRenderProps {
	materials: QueryResult<GetMaterialData>;
	addMaterial: MutationRenderProps<AddMaterialData, MaterialInput>;
	updateMaterial: MutationRenderProps<UpdateMaterialData, MaterialInput>;
	deleteMaterial: MutationRenderProps<DeleteMaterialData, { id: string }>;
}
const addToCache: MutationUpdaterFn<AddMaterialData> =
	initHandleCache<AddMaterialData, GetMaterialData>(GET_MATERIALS, (res, data) => {
		if(!res.materials) {
			res.materials = [];
		}
		res.materials.push(data.addMaterial);
		return res;
	});

const removeFromCache: MutationUpdaterFn<DeleteMaterialData> =
	initHandleCache<DeleteMaterialData, GetMaterialData>(GET_MATERIALS, (res, data) => {
		let index: number | undefined = undefined;
		if(!res.materials) {
			res.materials = [];
		}
		res.materials.forEach((material, i) => {
			if (material.id === data.deleteMaterial!.id) {
				index = i;
			}
		});
		if(index === undefined) {
			throw new Error("Entry not found");
		}
		res.materials.splice(index, 1);
		return res;
	});

const updateCache: MutationUpdaterFn<UpdateMaterialData> =
	initHandleCache<UpdateMaterialData, GetMaterialData>(GET_MATERIALS, (res, data) => {
		if(!res.materials) {
			res.materials = [];
		}
		res.materials.forEach(material => {
			if(material.id === data.updateMaterial.id) {
				material = data.updateMaterial;
			}
		});
		return res;
	});

export const MaterialWrapper = adopt<MaterialRenderProps, {}>({
	materials: ({ render }) => (
		<Query query={GET_MATERIALS} children={render!} />
	),
	addMaterial: ({ render }) => (
		<Mutation mutation={ADD_MATERIAL} update={addToCache}>
			{(mutation: MutationFn<AddMaterialData, MaterialInput>, res: MutationResult<AddMaterialData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	deleteMaterial: ({ render }) => (
		<Mutation mutation={DELETE_MATERIAL} update={removeFromCache}>
			{(mutation: MutationFn<DeleteMaterialData, { id: string }>, res: MutationResult<DeleteMaterialData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	updateMaterial: ({ render }) => (
		<Mutation mutation={UPDATE_MATERIAL} update={updateCache}>
			{
				(
					mutation: MutationFn<UpdateMaterialData, MaterialInput & { id: string }>,
					res: MutationResult<UpdateMaterialData>
				) => render!({ mutation, res })
			}
		</Mutation>
	)
});
