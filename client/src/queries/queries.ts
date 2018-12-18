import { gql } from "apollo-boost";

export const getUsersInventory = gql`
    {
        user {
            categories
            materials
        }
    }
`;

export const getTools = gql`
    {
        user {
            categories {
                tools
            }
        }
    }

`;
