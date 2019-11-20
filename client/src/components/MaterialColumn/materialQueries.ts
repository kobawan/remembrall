import { gql } from "apollo-boost";

const MaterialsFragment = gql`
	fragment MaterialsFragment on Material {
		__typename
		name
		id
		color
		amount
    inProjects @client {
			id
		}
		availableAmount @client
	}
`;

export const ADD_MATERIAL = gql`
	mutation AddMaterial($params: MaterialInput) {
		addMaterial(params: $params) {
			...MaterialsFragment
		}
	}
	${MaterialsFragment}
`;

export const GET_MATERIALS = gql`
	query Material {
		materials {
			...MaterialsFragment
		}
	}
	${MaterialsFragment}
`;

export const DELETE_MATERIAL = gql`
	mutation DeleteMaterial($id: ID!) {
		deleteMaterial(id: $id) {
			id
		}
	}
`;

export const UPDATE_MATERIAL = gql`
	mutation UpdateMaterial($id: ID!, $params: MaterialInput) {
		updateMaterial(id: $id, params: $params) {
			...MaterialsFragment
		}
	}
	${MaterialsFragment}
`;

// Client-side-only
export const UPDATE_MATERIAL_AVAILABLE_AMOUNT = gql`
	mutation UpdateMaterialAvailableAmount($id: ID!, $availableAmount: Int!) {
		updateMaterialAvailableAmount(id: $id, availableAmount: $availableAmount) @client {
			...MaterialsFragment
		}
	}
	${MaterialsFragment}
`;
