import { ApolloError } from "apollo-boost";
import { MutationRenderProps } from "../types";

export function logErrors(error: ApolloError | undefined, ...mutations: MutationRenderProps<any, any>[]) {
  if(error) {
    console.error(error);
  }
  mutations.forEach(mutation => {
    if(mutation.res.error) {
      console.error(mutation.res.error);
    }
  });
}
