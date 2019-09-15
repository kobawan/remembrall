import { CommonFields } from "../types";

export const getTagDisplayValue = <F extends CommonFields>(displayedFields: (keyof F)[], tag: F) => {
  return displayedFields
    .reduce((values: any[], field: keyof F) => {
      if(!tag[field]) {
        return values;
      }
      return field === "size"
        ? [...values, (tag[field] as any as string).replace(";", " ")]
        : [...values, tag[field]];
    }, [])
    .join(" - ");
};
