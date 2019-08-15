import React, { createContext } from "react";
import { State, Actions, initialState } from "./reducer";

interface ReducerContextType {
  state: State;
  dispatch: React.Dispatch<Actions>;
}

export const ReducerContext = createContext<ReducerContextType>({ state: initialState, dispatch: () => {} });

export const ReducerContextProvider = ReducerContext.Provider;
