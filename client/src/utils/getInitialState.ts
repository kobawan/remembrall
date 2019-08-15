/**
 * Merges two objects together. If the value on the second object is empty or doesn't
 * exist in the first object, then it is not added.
 */
export const getInitialState = <DS = {}, P = undefined>(defaultState: DS, props?: P): DS => {
  const state = { ...defaultState };
  if (!props) {
    return state;
  }
  const entries = Object.entries(props) as Array<[keyof DS, DS[keyof DS]]>;

  entries.forEach(([key, value]) => {
    if (value !== undefined && value !== null && (state as unknown as object).hasOwnProperty(key)) {
      state[key] = value;
    }
  });
  return state;
};
