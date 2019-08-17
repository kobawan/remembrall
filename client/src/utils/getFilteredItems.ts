import { FilterType } from "../components/FilterTooltip/FilterTooltip";
import { AmountField, InProjectField, CommonFields } from "../types";

export const getFilteredItems = <D extends CommonFields & Partial<AmountField & InProjectField>>(
  activeFilters: FilterType[],
  items: D[],
) => {
  const hasActiveUnusedFilter = activeFilters.includes(FilterType.unused);
  if(!hasActiveUnusedFilter) {
    return items;
  }

  const filteredItemsByUnused = items.filter(item => {
    if(typeof item.amount !== "number" || !Array.isArray(item.inProjects)) {
      return true;
    }
    return item.amount - item.inProjects.length > 0;
  });

  return filteredItemsByUnused;
};
