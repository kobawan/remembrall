import * as React from "react";
import { adopt } from "react-adopt";
import { QueryResult, Mutation, Query, MutationFn, MutationResult } from "react-apollo";
import { MutationUpdaterFn } from "apollo-boost";
import { CommonFields, MutationRenderProps, CategoryFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from "./categoryQueries";
import { GET_PROJECTS } from "../ProjectColumn/projectQueries";

interface GetCategoryData {
	categories?: CategoryFields[];
}

interface AddCategoryData {
	addCategory: CommonFields;
}

export interface DeleteCategoryData {
	deleteCategory: CommonFields;
}

interface UpdateCategoryData {
	updateCategory: CommonFields;
}

interface CategoryInput {
	params: Omit<CategoryFields, "id">;
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

export const CategoryWrapper = adopt<CategoryRenderProps, {}>({
	categories: ({ render }) => (
		<Query query={GET_CATEGORIES} children={render!} />
	),
	addCategory: ({ render }) => (
		<Mutation mutation={ADD_CATEGORY} update={addToCache}>
			{(mutation: MutationFn<AddCategoryData, CategoryInput>, res: MutationResult<AddCategoryData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	deleteCategory: ({ render }) => (
		<Mutation mutation={DELETE_CATEGORY} update={removeFromCache} refetchQueries={[{ query: GET_PROJECTS }]}>
			{(mutation: MutationFn<DeleteCategoryData, { id: string }>, res: MutationResult<DeleteCategoryData>) => {
				return render!({ mutation, res });
			}}
		</Mutation>
	),
	updateCategory: ({ render }) => (
		<Mutation mutation={UPDATE_CATEGORY} update={updateCache}>
			{
				(
					mutation: MutationFn<UpdateCategoryData, CategoryInput & { id: string }>,
					res: MutationResult<UpdateCategoryData>
				) => render!({ mutation, res })
			}
		</Mutation>
	)
});
