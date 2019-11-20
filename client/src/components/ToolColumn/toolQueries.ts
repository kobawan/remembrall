import { gql } from "apollo-boost";

const ToolsFragment = gql`
	fragment ToolsFragment on Tool {
		__typename
		name
		id
		amount
		type
		size
    inProjects @client {
			id
		}
		availableAmount @client
	}
`;

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

// Client-side-only
export const UPDATE_TOOL_AVAILABLE_AMOUNT = gql`
	mutation UpdateToolAvailableAmount($id: ID!, $availableAmount: Int!) {
		updateToolAvailableAmount(id: $id, availableAmount: $availableAmount) @client {
			...ToolsFragment
		}
	}
	${ToolsFragment}
`;
