import { QueryResult, MutationTuple } from "react-apollo";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { MutationUpdaterFn } from "apollo-boost";
import { CategoryFields } from "../../types";
import { initHandleCache } from "../../utils/cacheHandling";
import { GET_CATEGORIES, ADD_CATEGORY, DELETE_CATEGORY, UPDATE_CATEGORY } from "./categoryQueries";
import { GET_PROJECTS } from "../ProjectColumn/projectQueries";

interface GetCategoryData {
  categories?: CategoryFields[];
}

export interface AddCategoryData {
  addCategory: CategoryFields;
}

export interface DeleteCategoryData {
  deleteCategory: CategoryFields;
}

export interface UpdateCategoryData {
  updateCategory: CategoryFields;
}

export interface CategoryInput {
  params: Omit<CategoryFields, "id">;
}

type UseCategoryQueryAndMutationsRes = [
  QueryResult<GetCategoryData, undefined>,
  MutationTuple<AddCategoryData, CategoryInput>,
  MutationTuple<UpdateCategoryData, CategoryInput & { id: string }>,
  MutationTuple<DeleteCategoryData, { id: string }>,
];

type UseCategoryQueryRes = QueryResult<GetCategoryData, undefined>;

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

export const useCategoryQueryAndMutations = (): UseCategoryQueryAndMutationsRes => {
  return [
    useQuery(GET_CATEGORIES),
    useMutation(ADD_CATEGORY, { update: addToCache }),
    useMutation(UPDATE_CATEGORY, { update: updateCache }),
    useMutation(DELETE_CATEGORY, { update: removeFromCache, refetchQueries: [{ query: GET_PROJECTS }] }),
  ];
};

export const useCategoryQuery = (): UseCategoryQueryRes => {
  return useQuery(GET_CATEGORIES);
};
