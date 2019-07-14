import { gql } from "apollo-boost";

/**
 * USER
 */

export const LOGIN_USER = gql`
	mutation LoginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			id
		}
	}
`;

export const ADD_USER = gql`
	mutation AddUser($email: String!, $password: String!) {
		addUser(email: $email, password: $password) {
			id
		}
	}
`;
