import { gql } from "apollo-boost";

/**
 * FRAGMENTS
 */

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

const CategoriesFragment = gql`
	fragment CategoriesFragment on Category {
		name
		id
	}
`;

const ToolsFragment = gql`
	fragment ToolsFragment on Tool {
		name
		id
	}
`;

const MaterialsFragment = gql`
	fragment MaterialsFragment on Material {
		name
		id
	}
`;

/**
 * USER
 */

export const GET_USER_ID = gql`
	query User {
		user {
			id
		}
	}
`;

/**
 * PROJECTS
 */

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

/**
 * CATEGORIES
 */

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

/**
 * TOOLS
 */

export const ADD_TOOL = gql`
	mutation AddTool($params: ToolInput) {
		addTool(params: $params) {
			...ToolsFragment
		}
	}
	${ToolsFragment}
`;

export const GET_TOOLS = gql`
	query Tool {
		tools {
			...ToolsFragment
		}
	}
	${ToolsFragment}
`;

export const DELETE_TOOL = gql`
	mutation DeleteTool($id: ID!) {
		deleteTool(id: $id) {
			id
		}
	}
`;

export const UPDATE_TOOL = gql`
	mutation UpdateTool($id: ID!, $params: ToolInput) {
		updateTool(id: $id, params: $params) {
			...ToolsFragment
		}
	}
	${ToolsFragment}
`;

/**
 * MATERIALS
 */

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
