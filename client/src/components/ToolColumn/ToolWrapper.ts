import { QueryResult, MutationTuple } from "react-apollo";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MutationUpdaterFn } from "apollo-boost";
import { ToolFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_TOOLS, ADD_TOOL, DELETE_TOOL, UPDATE_TOOL } from "./toolQueries";
import { GET_PROJECTS } from "../ProjectColumn/projectQueries";

export interface GetToolData {
  tools?: ToolFields[];
}

export interface AddToolData {
  addTool: ToolFields;
}

export interface UpdateToolData {
  updateTool: ToolFields;
}

export interface DeleteToolData {
  deleteTool: { id: string } | null;
}

export interface ToolInput {
  params: Omit<ToolFields, "id">;
}

type UseToolQueryAndMutationsRes = [
  QueryResult<GetToolData, undefined>,
  MutationTuple<AddToolData, ToolInput>,
  MutationTuple<UpdateToolData, ToolInput & { id: string }>,
  MutationTuple<DeleteToolData, { id: string }>,
];

type UseToolQueryRes = QueryResult<GetToolData, undefined>;

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

export const useToolQueryAndMutations = (): UseToolQueryAndMutationsRes => {
  return [
    useQuery(GET_TOOLS),
    useMutation(ADD_TOOL, { update: addToCache }),
    useMutation(UPDATE_TOOL, { update: updateCache }),
    useMutation(DELETE_TOOL, { update: removeFromCache, refetchQueries: [{ query: GET_PROJECTS }] }),
  ];
};

export const useToolQuery = (): UseToolQueryRes => {
  return useQuery(GET_TOOLS);
};
