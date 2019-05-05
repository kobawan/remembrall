import { MutationUpdaterFn } from "react-apollo";

export const initHandleCache =
<Add, Get>(query: any, changeCb: (res: Get, data: Add) => Get): MutationUpdaterFn<Add> =>
(cache, { data }) => {
	try {
		if (!data) {
			throw new Error("No data available");
		}
		const res = cache.readQuery<Get>({ query });
		if(!res) {
			throw new Error("Cannot read cache!");
		}
		cache.writeData({ data: changeCb(res, data) });
	} catch(e) {
		// If not all of the data needed to fulfill this read is in Apollo Client’s cache
		// then an error will be thrown instead, so make sure to only read data that you know you have!
		console.error(e);
	}
};
