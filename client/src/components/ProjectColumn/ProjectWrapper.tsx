import * as React from "react";
import { Mutation, MutationUpdaterFn, Query, QueryResult, MutationFn, MutationResult } from "react-apollo";
import { adopt } from "react-adopt";
import { MutationRenderProps, ProjectFields, CategoryFields } from "../../types";
import { ADD_PROJECT, GET_PROJECTS, DELETE_PROJECT, UPDATE_PROJECT, UPDATE_PROJECT_TAGS } from "./projectQueries";
import { initHandleCache } from "../../utils/cacheHandling";
import { GetCategoryData } from "../CategoryColumn/CategoryWrapper";
import { GET_CATEGORIES } from "../CategoryColumn/categoryQueries";

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

interface UpdateProjectTagsData {
	updateProjectTags: CategoryFields[];
}

export interface ProjectRenderProps {
	addProject: MutationRenderProps<AddProjectData, ProjectInput>;
	deleteProject: MutationRenderProps<DeleteProjectData, { id: string }>;
	updateProject: MutationRenderProps<UpdateProjectData, ProjectInput & { id: string }>;
	projects: QueryResult<GetProjectData>;
	updateProjectTags: MutationRenderProps<UpdateProjectTagsData, { id: string }>;
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

/**
 * Updates categories to cache
 */
const updateCategoriesCache: MutationUpdaterFn<UpdateProjectTagsData> =
initHandleCache<UpdateProjectTagsData, GetCategoryData>(GET_CATEGORIES, (res, data) => {
	data.updateProjectTags.forEach(category => {
		(res.categories || []).forEach(cacheCategory => {
			if(cacheCategory.id === category.id) {
				cacheCategory = category;
			}
		});
	});
	return res;
});

export const ProjectWrapper = adopt<ProjectRenderProps, {}>({
	projects: ({ render }) => (
		<Query query={GET_PROJECTS} children={render!} />
	),
	addProject: ({ render }) => (
		<Mutation mutation={ADD_PROJECT} update={addToCache}>
			{(mutation: MutationFn<AddProjectData, ProjectInput>, res: MutationResult<AddProjectData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	deleteProject: ({ render }) => (
		<Mutation mutation={DELETE_PROJECT} update={removeFromCache}>
			{(mutation: MutationFn<DeleteProjectData, { id: string }>, res: MutationResult<DeleteProjectData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	updateProject: ({ render }) => (
		<Mutation mutation={UPDATE_PROJECT} update={updateCache}>
			{
				(
					mutation: MutationFn<UpdateProjectData, ProjectInput & { id: string }>,
					res: MutationResult<UpdateProjectData>
				) => render!({ mutation, res })
			}
		</Mutation>
	),
	updateProjectTags: ({ render }) => (
		<Mutation mutation={UPDATE_PROJECT_TAGS} update={updateCategoriesCache}>
			{
				(
					mutation: MutationFn<UpdateProjectTagsData, { id: string }>,
					res: MutationResult<UpdateProjectTagsData>
				) => render!({ mutation, res })
			}
		</Mutation>
	),
});
