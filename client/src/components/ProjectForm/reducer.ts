import React from "react";
import { ProjectFields } from "../../types";
import { UpdateProjectFieldAction, ProjectActionType } from "./actions";

type ProjectActions = (
  UpdateProjectFieldAction
);

export type ProjectState = Required<Omit<ProjectFields, "id"|"__typename">>;

export const initialProjectState: ProjectState = {
  name: "",
  categories: [],
  tools: [],
  materials: [],
  notes: "",
  instructions: "",
};

export type ProjectReducerType = React.Reducer<ProjectState, ProjectActions>;

export const projectReducer: ProjectReducerType = (state, action) => {
  switch (action.type) {
    case ProjectActionType.updateField:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
};
