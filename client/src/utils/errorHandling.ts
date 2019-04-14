import { MutationRenderProps } from "../types";

export function logMutationErrors(...mutations: MutationRenderProps<any, any>[]) {
	mutations.forEach(mutation => {
		if(mutation.res.error) {
			console.error(mutation.res.error);
		}
	});
}
