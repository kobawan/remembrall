import { gql } from "apollo-boost";

const ProjectsFragment = gql`
	fragment ProjectsFragment on Project {
		name
		id
		instructions
		notes
		categories {
			id
			name
		}
		materials {
			id
			name
		}
		tools {
			id
			name
		}
	}
`;

export const GET_PROJECTS = gql`
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
