import React from "react";
import { Mutation, Query, QueryResult, MutationFunction, MutationResult } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { adopt } from "react-adopt";
import { MutationRenderProps, ProjectFields } from "../../types";
import { ADD_PROJECT, GET_PROJECTS, DELETE_PROJECT, UPDATE_PROJECT } from "./projectQueries";
import { initHandleCache } from "../../utils/cacheHandling";

interface GetProjectData {
  projects?: ProjectFields[];
}

export interface AddProjectData {
  addProject: ProjectFields;
}

export interface ProjectInput {
  params: {
    name: string;
    categories: string[];
    materials: string[];
    tools: string[];
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

export interface ProjectRenderProps {
  addProject: MutationRenderProps<AddProjectData, ProjectInput>;
  deleteProject: MutationRenderProps<DeleteProjectData, { id: string }>;
  updateProject: MutationRenderProps<UpdateProjectData, ProjectInput & { id: string }>;
  projects: QueryResult<GetProjectData>;
}

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

export const ProjectWrapper = adopt<ProjectRenderProps, {}>({
  projects: ({ render }) => (
    <Query query={GET_PROJECTS} children={render!} />
  ),
  addProject: ({ render }) => (
    <Mutation mutation={ADD_PROJECT} update={addToCache}>
      {(mutation: MutationFunction<AddProjectData, ProjectInput>, res: MutationResult<AddProjectData>) => {
        return render!({ mutation, res });
      }}
    </Mutation>
  ),
  deleteProject: ({ render }) => (
    <Mutation mutation={DELETE_PROJECT} update={removeFromCache}>
      {(mutation: MutationFunction<DeleteProjectData, { id: string }>, res: MutationResult<DeleteProjectData>) => {
        return render!({ mutation, res });
      }}
    </Mutation>
  ),
  updateProject: ({ render }) => (
    <Mutation mutation={UPDATE_PROJECT} update={updateCache}>
      {
        (
          mutation: MutationFunction<UpdateProjectData, ProjectInput & { id: string }>,
          res: MutationResult<UpdateProjectData>
        ) => render!({ mutation, res })
      }
    </Mutation>
  )
});
