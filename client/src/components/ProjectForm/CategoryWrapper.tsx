import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { ProjectFields, CommonFields, MutationRenderProps } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_CATEGORIES, ADD_CATEGORY } from "../../queries/queries";

type GetCategoryData = Pick<ProjectFields, "categories">;
interface AddCategoryData {
	addCategory: CommonFields;
}
interface CategoryInput {
	params: { name: string, tools?: string[] };
}
export interface CategoryRenderProps {
	categories: QueryResult<GetCategoryData>;
	addCategory: MutationRenderProps<AddCategoryData, CategoryInput>;
}
const addToCache: MutationUpdaterFn<AddCategoryData> =
	initHandleCache<AddCategoryData, GetCategoryData>(GET_CATEGORIES, (res, data) => {
		if(!res.categories) {
			res.categories = [];
		}
		res.categories.push(data.addCategory);
		return res;
	});

export const CategoryWrapper = adopt<CategoryRenderProps>({
	categories: ({ render }) => (
		<Query query={GET_CATEGORIES} children={render} />
	),
	addCategory: ({ render }) => (
		<Mutation mutation={ADD_CATEGORY} update={addToCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
});
