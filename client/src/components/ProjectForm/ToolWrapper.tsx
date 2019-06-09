import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { ProjectFields, CommonFields, MutationRenderProps, AdoptInputProps } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_TOOLS, ADD_TOOL } from "../../queries/queries";

type GetToolData = Pick<ProjectFields, "tools">;
interface AddToolData {
	addTool: CommonFields;
}
interface ToolInput {
	params: { name: string, amount?: number };
}
export interface ToolRenderProps {
	tools: QueryResult<GetToolData>;
	addTool: MutationRenderProps<AddToolData, ToolInput>;
}
const addToCache: MutationUpdaterFn<AddToolData> =
	initHandleCache<AddToolData, GetToolData>(GET_TOOLS, (res, data) => {
		if(!res.tools) {
			res.tools = [];
		}
		res.tools.push(data.addTool);
		return res;
	});

const components: AdoptInputProps<ToolRenderProps> = {
	tools: ({ render }) => (
		<Query query={GET_TOOLS} children={render} />
	),
	addTool: ({ render }) => (
		<Mutation mutation={ADD_TOOL} update={addToCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
};

export const ToolWrapper = adopt<ToolRenderProps>(components);
