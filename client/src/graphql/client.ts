import { InMemoryCache, ApolloClient, ApolloLink, gql } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { getStorageKey, StorageKeys } from "../utils/localStorage";
import { CategoryFields, ToolFields, MaterialFields } from "../types";
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

const resolvers = {
  Category: {
    inProjects: (parent: CategoryFields, _: any, { cache }: { cache: DataProxy }) => {
      const res = cache.readQuery<GetProjectData>({ query: GET_PROJECTS });
      if(!res || !res.projects) {
        return [];
      }
      return res.projects.filter(({ categories }) => {
        return (categories || [])
          .map(({ id }) => id)
          .includes(parent.id);
      });
    },
  },
  Tool: {
    inProjects: (parent: ToolFields, _: any, { cache }: { cache: DataProxy }) => {
      const res = cache.readQuery<GetProjectData>({ query: GET_PROJECTS });
      if(!res || !res.projects) {
        return [];
      }
      return res.projects.filter(({ tools }) => {
        return (tools || [])
          .map(({ id }) => id)
          .includes(parent.id);
      });
    },
  },
  Material: {
    inProjects: (parent: MaterialFields, _: any, { cache }: { cache: DataProxy }) => {
      const res = cache.readQuery<GetProjectData>({ query: GET_PROJECTS });
      if(!res || !res.projects) {
        return [];
      }
      return res.projects.filter(({ materials }) => {
        return (materials || [])
          .map(({ id }) => id)
          .includes(parent.id);
      });
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