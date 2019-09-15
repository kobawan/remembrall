import { MutationTuple, QueryResult } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ProjectFields } from "../../types";
import { ADD_PROJECT, GET_PROJECTS, DELETE_PROJECT, UPDATE_PROJECT } from "./projectQueries";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_CATEGORIES } from "../CategoryColumn/categoryQueries";
import { GET_TOOLS } from "../ToolColumn/toolQueries";
import { GET_MATERIALS } from "../MaterialColumn/materialQueries";

export interface GetProjectData {
  projects?: ProjectFields[];
}

export interface AddProjectData {
  addProject: ProjectFields;
}

export interface ProjectInput {
  params: {
    name: string;
    categories: string[];
    materials: { id: string, amountUsed: number }[];
    tools: { id: string, amountUsed: number }[];
    instructions?: string;
    notes?: string;
  };
}

export interface DeleteProjectData {
  deleteProject: { id: string } | null;
}

export interface UpdateProjectData {
  updateProject: ProjectFields;
}

type UseProjectQueryAndMutationsRes = [
  QueryResult<GetProjectData, undefined>,
  MutationTuple<AddProjectData, ProjectInput>,
  MutationTuple<UpdateProjectData, ProjectInput & { id: string }>,
  MutationTuple<DeleteProjectData, { id: string }>,
];

const addToCache: MutationUpdaterFn<AddProjectData> =
  initHandleCache<AddProjectData, GetProjectData>(GET_PROJECTS, (res, data) => {
    if(!res.projects) {
      res.projects = [];
    }
    res.projects.push(data.addProject);
    return res;
  });

const removeFromCache: MutationUpdaterFn<DeleteProjectData> =
  initHandleCache<DeleteProjectData, GetProjectData>(GET_PROJECTS, (res, data) => {
    let index: number | undefined = undefined;
    if(!res.projects) {
      res.projects = [];
    }
    res.projects.forEach((project, i) => {
      if (project.id === data.deleteProject!.id) {
        index = i;
      }
    });
    if(index === undefined) {
      throw new Error("Entry not found");
    }
    res.projects.splice(index, 1);
    return res;
  });

/**
 * Updates project to cache
 */
const updateCache: MutationUpdaterFn<UpdateProjectData> =
initHandleCache<UpdateProjectData, GetProjectData>(GET_PROJECTS, (res, data) => {
  if(!res.projects) {
    res.projects = [];
  }
  res.projects.forEach(project => {
    if(project.id === data.updateProject.id) {
      project = data.updateProject;
    }
  });
  return res;
});

export const useProjectQueryAndMutations = (): UseProjectQueryAndMutationsRes => {
  // @todo check if refetching is needed
  return [
    useQuery(GET_PROJECTS),
    useMutation(ADD_PROJECT, {
      update: addToCache,
      refetchQueries: [
        { query: GET_CATEGORIES },
        { query: GET_TOOLS },
        { query: GET_MATERIALS }
      ]
    }),
    useMutation(UPDATE_PROJECT, {
      update: updateCache,
      refetchQueries: [
        { query: GET_CATEGORIES },
        { query: GET_TOOLS },
        { query: GET_MATERIALS }
      ]
    }),
    useMutation(DELETE_PROJECT, { update: removeFromCache }),
  ];
};
