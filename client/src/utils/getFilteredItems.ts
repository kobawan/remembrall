import { FilterType } from "../components/FilterTooltip/FilterTooltip";

export const getFilteredItems = <D extends { amount: number }>(activeFilters: FilterType[], items: D[]) => {
  const hasActiveUnusedFilter = activeFilters.includes(FilterType.unused);
  if(!hasActiveUnusedFilter) {
    return items;
  }

  // @todo deduct items being used in projects
  return items.filter(item => item.amount);
};
