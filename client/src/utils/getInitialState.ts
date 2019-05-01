/**
 * Merges two objects together. If the value on the second object is empty or doesn't
 * exist in the first object, then it is not added.
 */
export const getInitialState = <DS = {}, P = undefined>(defaultState: DS, props?: P): DS => {
	if (!props) {
		return defaultState;
	}
	const entries = Object.entries(props) as Array<[keyof DS, DS[keyof DS]]>;

	entries.forEach(([key, value]) => {
		if (value !== undefined && value !== null && defaultState.hasOwnProperty(key)) {
			defaultState[key] = value;
		}
	});
	return defaultState;
};
