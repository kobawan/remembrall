import { gql } from "apollo-boost";

const UserFragment = gql`
    fragment UserFragment on User {
        id
        categories {
            name
            id
            tools {
                id
                name
                amount
            }
        }
        tools {
            name
            id
            amount
        }
        materials {
            name
            id
            amount
        }
        projects {
            name
            instructions
            notes
            categories {
                name
                tools {
                    name
                    id
                    amount
                }
            }
            tools {
                name
                amount
                id
            }
            materials {
                name
                amount
                id
            }
        }
    }
`;

export const GET_USER = gql`
	query User($id: ID) {
		user(id: $id) {
            ...UserFragment
		}
	}
    ${UserFragment}
`;

export const ADD_USER = gql`
	mutation AddUser {
		addUser {
			...UserFragment
		}
	}
    ${UserFragment}
`;
