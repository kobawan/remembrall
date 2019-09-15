import { InMemoryCache, ApolloClient, ApolloLink, gql } from "apollo-boost";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { getStorageKey, StorageKeys } from "../utils/localStorage";
import {
  CategoryFields,
  ToolFields,
  MaterialFields,
  ProjectFields,
  TempAnyObject,
  CommonFields,
  AmountField,
  InProjectField,
  ProjectFieldWithAmountUsed,
} from "../types";
import { DataProxy } from "apollo-cache";
import { GET_PROJECTS } from "../components/ProjectColumn/projectQueries";
import { GetProjectData } from "../components/ProjectColumn/ProjectWrapper";

const typeDefs = gql`
  extend type Category {
    inProjects: [Project]
  }
  extend type Tool {
    inProjects: [Project]
    availableAmount: Int
  }
  extend type Material {
    inProjects: [Project]
    availableAmount: Int
  }
`;

type ProjectFieldKeysWithInProjects = Extract<keyof ProjectFields, "categories" | "tools" | "materials">;
type ProjectFieldsKeysWithAmount = Exclude<ProjectFieldKeysWithInProjects, "categories">;

const getInProjects = (
  parent: { id: string },
  cache: DataProxy,
  key: ProjectFieldKeysWithInProjects
) => {
  try {
    const res = cache.readQuery<GetProjectData>({ query: GET_PROJECTS });
    if(!res || !res.projects) {
      return [];
    }
    return res.projects.filter(project => {
      return ((project[key] || []) as TempAnyObject[])
        .map(field => field.hasOwnProperty("id") ? field.id : field.entry.id)
        .includes(parent.id);
    });
  } catch(e) {
    // Failed to get projects field. App is not loaded yet
    return [];
  }
};

const getAvailableAmount = (
  parent: CommonFields & AmountField & Required<InProjectField>,
  cache: DataProxy,
  key: ProjectFieldsKeysWithAmount
) => {
  const inProjects = getInProjects(parent, cache, key);
  if(!inProjects || !inProjects.length) {
    return parent.amount;
  }
  return inProjects.reduce((tAmount, project) => {
    const item = ((project[key] || []) as ProjectFieldWithAmountUsed<CommonFields>[])
      .find(({ entry }) => entry.id === parent.id);
    return item ? tAmount - item.amountUsed : tAmount;
  }, parent.amount);
};

const resolvers = {
  Category: {
    inProjects: (parent: CategoryFields, _: any, { cache }: { cache: DataProxy }) => {
      return getInProjects(parent, cache, "categories");
    },
  },
  Tool: {
    inProjects: (parent: ToolFields, _: any, { cache }: { cache: DataProxy }) => {
      return getInProjects(parent, cache, "tools");
    },
    availableAmount: (parent: ToolFields, _: any, { cache }: { cache: DataProxy }) => {
      return getAvailableAmount(parent, cache, "tools");
    }
  },
  Material: {
    inProjects: (parent: MaterialFields, _: any, { cache }: { cache: DataProxy }) => {
      return getInProjects(parent, cache, "materials");
    },
    availableAmount: (parent: MaterialFields, _: any, { cache }: { cache: DataProxy }) => {
      return getAvailableAmount(parent, cache, "materials");
    }
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