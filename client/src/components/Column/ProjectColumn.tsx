import * as React from "react";
import { Mutation, MutationFn, MutationUpdaterFn, Query, QueryResult } from "react-apollo";
import { adopt } from "react-adopt";
import { Column } from "./Column";
import { ColumnType, CommonFields, MutationRenderProps } from "../../types";
import { ADD_PROJECT, GET_PROJECT, DELETE_PROJECT, UPDATE_PROJECT } from "../../queries/queries";
import { logMutationErrors } from "../../utils/errorHandling";

interface GetProjectData {
	projects: CommonFields[];
}

interface AddProjectData {
	addProject: CommonFields;
}

interface ProjectInput {
	params: {
		name: string;
		categories: string[];
		materials: string[];
		tools: string[];
	};
}

interface DeleteProjectData {
	deleteProject: { id: string } | null;
}

interface UpdateProjectData {
	updateProject: CommonFields;
}

interface AdoptRenderProps {
	addProject: MutationRenderProps<AddProjectData, ProjectInput>;
	deleteProject: MutationRenderProps<DeleteProjectData, { id: string }>;
	updateProject: MutationRenderProps<UpdateProjectData, ProjectInput & { id: string }>;
	projects: QueryResult<GetProjectData>;
}

const addToCache: MutationUpdaterFn<AddProjectData> = (cache, { data }) => {
	try {
		if (!data) {
			throw new Error("No data available");
		}
		const res = cache.readQuery<GetProjectData>({ query: GET_PROJECT });
		if(!res) {
			throw new Error("Cannot read cache!");
		}
		res.projects.push(data.addProject);
		cache.writeData({ data: res });
	} catch(e) {
		// If not all of the data needed to fulfill this read is in Apollo Client’s cache
		// then an error will be thrown instead, so make sure to only read data that you know you have!
		console.error(e);
	}
};

const removeFromCache: MutationUpdaterFn<DeleteProjectData> = (cache, { data }) => {
	try {
		if (!data) {
			throw new Error("No data available");
		}
		if (!data.deleteProject) {
			throw new Error("Entry already deleted");
		}
		const res = cache.readQuery<GetProjectData>({ query: GET_PROJECT });
		if(!res) {
			throw new Error("Cannot read cache!");
		}
		let index: number | undefined = undefined;
		res.projects.forEach((project, i) => {
			if (project.id === data.deleteProject!.id) {
				index = i;
			}
		});
		if(index === undefined) {
			throw new Error("Entry not found");
		}
		res.projects.splice(index, 1);
		cache.writeData({ data: res });
	} catch(e) {
		// If not all of the data needed to fulfill this read is in Apollo Client’s cache
		// then an error will be thrown instead, so make sure to only read data that you know you have!
		console.error(e);
	}
};

/**
 * Updates project name to cache
 */
const updateCache: MutationUpdaterFn<UpdateProjectData> = (cache, { data }) => {
	try {
		if (!data) {
			throw new Error("No data available");
		}
		const res = cache.readQuery<GetProjectData>({ query: GET_PROJECT });
		if(!res) {
			throw new Error("Cannot read cache!");
		}
		res.projects.forEach(project => {
			if(project.id === data.updateProject.id) {
				project.name = data.updateProject.name;
			}
		});
		cache.writeData({ data: res });
	} catch(e) {
		// If not all of the data needed to fulfill this read is in Apollo Client’s cache
		// then an error will be thrown instead, so make sure to only read data that you know you have!
		console.error(e);
	}
};

const ProjectContainer = adopt<AdoptRenderProps>({
	projects: ({ render }) => (
		<Query query={GET_PROJECT} children={render} />
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

export class ProjectColumn extends React.PureComponent {
	public render() {
		return (
			<ProjectContainer>
				{({ addProject, deleteProject, updateProject, projects: { data, error }}: AdoptRenderProps) => {
					/**
					 * @todo handle loading?
					 */
					if(error) {
						console.error(error);
					}
					logMutationErrors(addProject, deleteProject, updateProject);

					return (
						<Column
							tickets={data && data.projects ? data.projects : []}
							type={ColumnType.Projects}
							createTicket={addProject.mutation as MutationFn}
							deleteTicket={deleteProject.mutation as MutationFn}
							updateTicket={updateProject.mutation as MutationFn}
						/>
					);
				}}
			</ProjectContainer>
		);
	}
}
