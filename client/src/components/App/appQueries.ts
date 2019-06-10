import { gql } from "apollo-boost";

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
