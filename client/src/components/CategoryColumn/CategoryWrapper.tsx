import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { CommonFields, MutationRenderProps, CategoryFields, AdoptInputProps } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from "../../queries/queries";

interface GetCategoryData {
	categories?: CategoryFields[];
}

interface AddCategoryData {
	addCategory: CommonFields;
}

interface DeleteCategoryData {
	deleteCategory: CommonFields;
}

interface UpdateCategoryData {
	updateCategory: CommonFields;
}

interface CategoryInput {
	params: Pick<CategoryFields, Exclude<keyof CategoryFields, "id">>;
}

export interface CategoryRenderProps {
	categories: QueryResult<GetCategoryData>;
	addCategory: MutationRenderProps<AddCategoryData, CategoryInput>;
	deleteCategory: MutationRenderProps<DeleteCategoryData, { id: string }>;
	updateCategory: MutationRenderProps<UpdateCategoryData, CategoryInput & { id: string }>;
}
const addToCache: MutationUpdaterFn<AddCategoryData> =
	initHandleCache<AddCategoryData, GetCategoryData>(GET_CATEGORIES, (res, data) => {
		if(!res.categories) {
			res.categories = [];
		}
		res.categories.push(data.addCategory);
		return res;
	});

const removeFromCache: MutationUpdaterFn<DeleteCategoryData> =
	initHandleCache<DeleteCategoryData, GetCategoryData>(GET_CATEGORIES, (res, data) => {
		let index: number | undefined = undefined;
		if(!res.categories) {
			res.categories = [];
		}
		res.categories.forEach((category, i) => {
			if (category.id === data.deleteCategory!.id) {
				index = i;
			}
		});
		if(index === undefined) {
			throw new Error("Entry not found");
		}
		res.categories.splice(index, 1);
		return res;
	});

const updateCache: MutationUpdaterFn<UpdateCategoryData> =
initHandleCache<UpdateCategoryData, GetCategoryData>(GET_CATEGORIES, (res, data) => {
	if(!res.categories) {
		res.categories = [];
	}
	res.categories.forEach(category => {
		if(category.id === data.updateCategory.id) {
			category = data.updateCategory;
		}
	});
	return res;
});

const components: AdoptInputProps<CategoryRenderProps> = {
	categories: ({ render }) => (
		<Query query={GET_CATEGORIES} children={render} />
	),
	addCategory: ({ render }) => (
		<Mutation mutation={ADD_CATEGORY} update={addToCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
	deleteCategory: ({ render }) => (
		<Mutation mutation={DELETE_CATEGORY} update={removeFromCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	),
	updateCategory: ({ render }) => (
		<Mutation mutation={UPDATE_CATEGORY} update={updateCache}>
			{(mutation, res) => render({ mutation, res })}
		</Mutation>
	)
};

export const CategoryWrapper = adopt<CategoryRenderProps>(components);
