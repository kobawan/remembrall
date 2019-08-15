import { ApolloError } from "apollo-boost";

export function logErrors(...errors: (ApolloError | undefined)[]) {
  errors.forEach(error => { if(error) console.error(error); });
}
