import flow from "lodash.flow";
import { FilterType } from "../components/FilterTooltip/FilterTooltip";
import { AmountField, InProjectField, CommonFields } from "../types";
import { Filter } from "../components/ColumnsManager/types";

type FilterItemsInput = CommonFields & Partial<AmountField & InProjectField>;
interface Options<D>{
  activeFilters: Filter[];
  items: D[];
}
type FilterFn = <D extends FilterItemsInput>(options: Options<D>) => Options<D>;

const handleUnusedFilter: FilterFn = ({ activeFilters, items }) => {
  if(!activeFilters.some(({ type }) => type === FilterType.unused)) {
    return { activeFilters, items };
  }

  const filteredItems = items.filter((item: any) => {
    if(typeof item.amount !== "number" || !Array.isArray(item.inProjects)) {
      return true;
    }
    return item.amount - item.inProjects.length > 0;
  });

  return { activeFilters, items: filteredItems };
};

const handleLinkedFilter: FilterFn = ({ activeFilters, items }) => {
  const filter = activeFilters.find(({ type }) => type === FilterType.linked);
  if(!filter || !filter.ticket) {
    return { activeFilters, items };
  }

  const filterInProjects = filter.ticket!.inProjects
    ? filter.ticket!.inProjects.map(({ id }: { id: string }) => id)
    : [filter.ticket!.id];

  const filteredItems = items.filter((item: any) => {
    // if item matches ticket where filter was clicked
    if(item.id === filter.ticket!.id) {
      return true;
    }
    // if item is a project
    if(!Array.isArray(item.inProjects)) {
      return filterInProjects.includes(item.id);
    }

    // match project ids from inProjects fields
    const itemInProjects = item.inProjects.map(({ id }: { id: string }) => id);
    return [...itemInProjects, ...filterInProjects].some((value, _, arr) => {
      return arr.filter(val => val === value).length > 1;
    });
  });

  return { activeFilters, items: filteredItems };
};

export const getFilteredItems = <D extends FilterItemsInput>(options: Options<D>): D[] => {
  return flow([
    handleUnusedFilter,
    handleLinkedFilter,
  ])(options).items;
};
