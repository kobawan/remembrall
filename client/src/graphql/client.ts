import { InMemoryCache, ApolloClient, ApolloLink, gql } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { getStorageKey, StorageKeys } from "../utils/localStorage";
import { CategoryFields, ToolFields, MaterialFields, ProjectFields } from "../types";
import { DataProxy } from "apollo-cache";
import { GET_PROJECTS } from "../components/ProjectColumn/projectQueries";
import { GetProjectData } from "../components/ProjectColumn/ProjectWrapper";

const typeDefs = gql`
  extend type Category {
    inProjects: [Project]
  }
  extend type Tool {
    inProjects: [Project]
  }
  extend type Material {
    inProjects: [Project]
  }
`;

type ProjectFieldKeysWithInProjects = Extract<keyof ProjectFields, "categories" | "tools" | "materials">;

const getInProjects = (parent: { id: string }, cache: DataProxy, key: ProjectFieldKeysWithInProjects) => {
  try {
    const res = cache.readQuery<GetProjectData>({ query: GET_PROJECTS });
    if(!res || !res.projects) {
      return [];
    }
    return res.projects.filter(project => {
      const fields = (project[key] || []) as ProjectFields[];
      return fields
        .map(({ id }) => id)
        .includes(parent.id);
    });
  } catch(e) {
    // Failed to get projects field. App is not loaded yet
    return [];
  }
};

const resolvers = {
  Category: {
    inProjects: (parent: CategoryFields, _: any, { cache }: { cache: DataProxy }) => {
      // @todo FIXME
      return getInProjects(parent, cache, "categories");
    },
  },
  Tool: {
    inProjects: (parent: ToolFields, _: any, { cache }: { cache: DataProxy }) => {
      return getInProjects(parent, cache, "tools");
    },
  },
  Material: {
    inProjects: (parent: MaterialFields, _: any, { cache }: { cache: DataProxy }) => {
      return getInProjects(parent, cache, "materials");
    },
  }
};

const cache = new InMemoryCache();

const link = ApolloLink.from([
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: getStorageKey(StorageKeys.UserId),
    }
  })),
  createHttpLink({ uri: "/graphql" }),
]);

export const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers,
});