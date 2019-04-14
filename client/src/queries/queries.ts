import { gql } from "apollo-boost";

const ProjectsFragment = gql`
	fragment ProjectsFragment on Project {
		name
		id
	}
`;

const UserFragment = gql`
	fragment UserFragment on User {
		id
		categories {
			name
			id
		}
		tools {
			name
			id
		}
		materials {
			name
			id
		}
		projects {
			...ProjectsFragment
		}
	}
	${ProjectsFragment}
`;

export const GET_USER = gql`
	query User {
		user {
			...UserFragment
		}
	}
	${UserFragment}
`;

export const GET_PROJECT = gql`
	query Project {
		projects {
			...ProjectsFragment
		}
	}
	${ProjectsFragment}
`;

export const ADD_PROJECT = gql`
	mutation AddProject($params: ProjectInput) {
		addProject(params: $params) {
			...ProjectsFragment
		}
	}
	${ProjectsFragment}
`;

export const UPDATE_PROJECT = gql`
	mutation UpdateProject($id: ID!, $params: ProjectInput) {
		updateProject(id: $id, params: $params) {
			...ProjectsFragment
		}
	}
	${ProjectsFragment}
`;

export const DELETE_PROJECT = gql`
	mutation DeleteProject($id: ID!) {
		deleteProject(id: $id) {
			id
		}
	}
`;

export const ADD_CATEGORY = gql`
	mutation AddCategory(
		$name: String!,
		$tools: [ID],
	) {
		addCategory(
			name: $name,
			tools: $tools,
		) {
			name
		}
	}
`;

export const ADD_TOOL = gql`
	mutation AddTool(
		$name: String!,
		$amount: Int,
	) {
		addTool(
			name: $name,
			amount: $amount,
		) {
			name
		}
	}
`;

export const ADD_MATERIAL = gql`
	mutation AddMaterial(
		$name: String!,
		$amount: Int,
	) {
		addMaterial(
			name: $name,
			amount: $amount,
		) {
			name
		}
	}
`;
