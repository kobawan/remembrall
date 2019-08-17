import { gql } from "apollo-boost";

const MaterialsFragment = gql`
	fragment MaterialsFragment on Material {
		name
		id
		color
		amount
    inProjects @client {
			id
		}
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
