import * as React from "react";
import { Mutation, MutationUpdaterFn, Query, QueryResult } from "react-apollo";
import { adopt } from "react-adopt";
import { MutationRenderProps, ProjectFields } from "../../types";
import { ADD_PROJECT, GET_PROJECTS, DELETE_PROJECT, UPDATE_PROJECT } from "../../queries/queries";
import { initHandleCache } from "../../utils/cacheHandling";

interface GetProjectData {
	projects?: ProjectFields[];
}

interface AddProjectData {
	addProject: ProjectFields;
}

interface ProjectInput {
	params: Pick<ProjectFields, Exclude<keyof ProjectFields, "id">>;
}

interface DeleteProjectData {
	deleteProject: { id: string } | null;
}

interface UpdateProjectData {
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
 * Updates project name to cache
 */
const updateCache: MutationUpdaterFn<UpdateProjectData> =
initHandleCache<UpdateProjectData, GetProjectData>(GET_PROJECTS, (res, data) => {
	if(!res.projects) {
		res.projects = [];
	}
	res.projects.forEach(project => {
		if(project.id === data.updateProject.id) {
			project.name = data.updateProject.name;
		}
	});
	return res;
});

export const ProjectWrapper = adopt<ProjectRenderProps>({
	projects: ({ render }) => (
		<Query query={GET_PROJECTS} children={render} />
	),
	addProject: ({ render }) => (
		<Mutation mutation={ADD_PROJECT} update={addToCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
	deleteProject: ({ render }) => (
		<Mutation mutation={DELETE_PROJECT} update={removeFromCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
	updateProject: ({ render }) => (
		<Mutation mutation={UPDATE_PROJECT} update={updateCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	)
});
