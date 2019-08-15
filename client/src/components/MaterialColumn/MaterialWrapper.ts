import { QueryResult, MutationTuple } from "react-apollo";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MutationUpdaterFn } from "apollo-boost";
import { MaterialFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_MATERIALS, ADD_MATERIAL, DELETE_MATERIAL, UPDATE_MATERIAL } from "./materialQueries";
import { GET_PROJECTS } from "../ProjectColumn/projectQueries";

interface GetMaterialData {
  materials?: MaterialFields[];
}

export interface AddMaterialData {
  addMaterial: MaterialFields;
}

export interface UpdateMaterialData {
  updateMaterial: MaterialFields;
}

export interface DeleteMaterialData {
  deleteMaterial: { id: string } | null;
}

export interface MaterialInput {
  params: Omit<MaterialFields, "id">;
}

type UseMaterialQueryAndMutationsRes = [
  QueryResult<GetMaterialData, undefined>,
  MutationTuple<AddMaterialData, MaterialInput>,
  MutationTuple<UpdateMaterialData, MaterialInput & { id: string }>,
  MutationTuple<DeleteMaterialData, { id: string }>,
];

type UseMaterialQueryAndAddMutationsRes = [
  QueryResult<GetMaterialData, undefined>,
  MutationTuple<AddMaterialData, MaterialInput>,
];

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

export const useMaterialQueryAndMutations = (): UseMaterialQueryAndMutationsRes => {
  return [
    useQuery(GET_MATERIALS),
    useMutation(ADD_MATERIAL, { update: addToCache }),
    useMutation(UPDATE_MATERIAL, { update: updateCache }),
    useMutation(DELETE_MATERIAL, { update: removeFromCache, refetchQueries: [{ query: GET_PROJECTS }] }),
  ];
};

export const useMaterialQueryAndAddMutation = (): UseMaterialQueryAndAddMutationsRes => {
  return [
    useQuery(GET_MATERIALS),
    useMutation(ADD_MATERIAL, { update: addToCache }),
  ];
};
