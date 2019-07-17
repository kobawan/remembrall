import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query, MutationFn, MutationResult } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { CommonFields, MutationRenderProps, ToolFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_TOOLS, ADD_TOOL, DELETE_TOOL, UPDATE_TOOL } from "./toolQueries";
import { GET_PROJECTS } from "../ProjectColumn/projectQueries";

interface GetToolData {
	tools?: ToolFields[];
}

interface AddToolData {
	addTool: CommonFields;
}

interface UpdateToolData {
	updateTool: CommonFields;
}

export interface DeleteToolData {
	deleteTool: CommonFields;
}

interface ToolInput {
	params: { name: string, amount?: number };
}

export interface ToolRenderProps {
	tools: QueryResult<GetToolData>;
	addTool: MutationRenderProps<AddToolData, ToolInput>;
	updateTool: MutationRenderProps<UpdateToolData, ToolInput>;
	deleteTool: MutationRenderProps<DeleteToolData, { id: string }>;
}

const addToCache: MutationUpdaterFn<AddToolData> =
	initHandleCache<AddToolData, GetToolData>(GET_TOOLS, (res, data) => {
		if(!res.tools) {
			res.tools = [];
		}
		res.tools.push(data.addTool);
		return res;
	});

const removeFromCache: MutationUpdaterFn<DeleteToolData> =
	initHandleCache<DeleteToolData, GetToolData>(GET_TOOLS, (res, data) => {
		let index: number | undefined = undefined;
		if(!res.tools) {
			res.tools = [];
		}
		res.tools.forEach((tool, i) => {
			if (tool.id === data.deleteTool!.id) {
				index = i;
			}
		});
		if(index === undefined) {
			throw new Error("Entry not found");
		}
		res.tools.splice(index, 1);
		return res;
	});

const updateCache: MutationUpdaterFn<UpdateToolData> =
initHandleCache<UpdateToolData, GetToolData>(GET_TOOLS, (res, data) => {
	if(!res.tools) {
		res.tools = [];
	}
	res.tools.forEach(tool => {
		if(tool.id === data.updateTool.id) {
			tool = data.updateTool;
		}
	});
	return res;
});

export const ToolWrapper = adopt<ToolRenderProps, {}>({
	tools: ({ render }) => (
		<Query query={GET_TOOLS} children={render!} />
	),
	addTool: ({ render }) => (
		<Mutation mutation={ADD_TOOL} update={addToCache}>
			{(mutation: MutationFn<AddToolData, ToolInput>, res: MutationResult<AddToolData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	deleteTool: ({ render }) => (
		<Mutation mutation={DELETE_TOOL} update={removeFromCache} refetchQueries={[{ query: GET_PROJECTS }]}>
			{(mutation: MutationFn<DeleteToolData, { id: string }>, res: MutationResult<DeleteToolData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	updateTool: ({ render }) => (
		<Mutation mutation={UPDATE_TOOL} update={updateCache}>
			{
				(
					mutation: MutationFn<UpdateToolData, ToolInput & { id: string }>,
					res: MutationResult<UpdateToolData>
				) => render!({ mutation, res })
			}
		</Mutation>
	)
});
