import { gql } from "apollo-boost";

const ProjectsFragment = gql`
    fragment ProjectsFragment on User {
        projects {
            name
            id
        }
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
        ...ProjectsFragment
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
		user {
            ...ProjectsFragment
		}
	}
    ${ProjectsFragment}
`;

export const ADD_PROJECT = gql`
    mutation AddProject(
        $name: String!,
        $categories: [ID],
        $materials: [ID],
        $tools: [ID],
    ) {
        addProject(
            name: $name,
            categories: $categories,
            materials: $materials,
            tools: $tools,
        ) {
            name
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

export const DELETE_TICKET = gql`
    mutation DeleteTicket($userId: ID, $id: ID) {
        deleteEntry(userId: $userId, id: $id) {
            id
        }
    }
`;
