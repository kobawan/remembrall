import { gql } from "apollo-boost";

const CategoriesFragment = gql`
	fragment CategoriesFragment on Category {
		__typename
		name
		id
    inProjects @client {
			id
		}
	}
`;

export const ADD_CATEGORY = gql`
	mutation AddCategory($params: CategoryInput) {
		addCategory(params: $params) {
			...CategoriesFragment
		}
	}
	${CategoriesFragment}
`;

export const GET_CATEGORIES = gql`
	query Category {
		categories {
			...CategoriesFragment
		}
	}
	${CategoriesFragment}
`;

export const DELETE_CATEGORY = gql`
	mutation DeleteCategory($id: ID!) {
		deleteCategory(id: $id) {
			id
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation UpdateCategory($id: ID!, $params: CategoryInput) {
		updateCategory(id: $id, params: $params) {
			...CategoriesFragment
		}
	}
	${CategoriesFragment}
`;
