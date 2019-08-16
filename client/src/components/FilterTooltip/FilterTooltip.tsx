import React, { useState, useContext } from "react";
import cx from "classnames";
import * as styles from "./filterTooltip.less";
import { Overlay } from "../Overlay/Overlay";
import { OverlayZIndex } from "../../types";
import { Checkbox } from "../Checkbox/Checkbox";
import { ReducerContext } from "../ColumnsManager/context";
import { closeFilterTooltipAction, setFilterAction, removeFilterAction } from "../ColumnsManager/actions";
import { Actions } from "../ColumnsManager/reducer";

const TICKET_TOOLTIP_SIZE = 200;

export enum FilterType {
  linked = "linked",
  unused = "unused",
}

const FilterTooltipCheckboxText = {
  [FilterType.linked]: "Linked resources",
  [FilterType.unused]: "All available resources",
};

export enum FilterTooltipPosition {
  left = "left",
  right = "right",
}

const filterTooltipPositionMap = {
  [FilterTooltipPosition.left]: styles.left,
  [FilterTooltipPosition.right]: styles.right,
};

const useFilter = (
  filter: FilterType,
  activeFilters: FilterType[],
  dispatch: React.Dispatch<Actions>
) => {
  const isStateFilterActive = activeFilters.includes(filter);
  const [ checkboxChecked, setCheckboxCheckedState ] = useState(isStateFilterActive);
  const Component = (
    <Checkbox
      text={FilterTooltipCheckboxText[filter]}
      isChecked={checkboxChecked}
      onChange={() => setCheckboxCheckedState(!checkboxChecked)}
    />
  );

  const handleFilter = () => {
    if (isStateFilterActive !== checkboxChecked) {
      checkboxChecked
      ? setFilterAction(dispatch, filter)
      : removeFilterAction(dispatch, filter);
    }
  };
  return {
    handleFilter,
    Component,
  };
};

export interface BasicFilterTooltipProps {
  top: number;
  left: number;
  ticketWidth: number;
  filters: FilterType[];
  withRemoveAllButton: boolean;
}

export const FilterTooltip: React.FC<BasicFilterTooltipProps> = ({
  top,
  left,
  ticketWidth,
  filters,
  withRemoveAllButton,
}) => {
  const { state: { filterTooltipState: { activeFilters } }, dispatch } = useContext(ReducerContext);
  const linkedFilter = filters.includes(FilterType.linked)
    ? useFilter(FilterType.linked, activeFilters, dispatch)
    : undefined;
  const unusedFilter = filters.includes(FilterType.unused)
    ? useFilter(FilterType.unused, activeFilters, dispatch)
    : undefined;

  // @todo handle window resizing
  const showLeft = document.body.clientWidth - left - ticketWidth < TICKET_TOOLTIP_SIZE;
  const position = showLeft ? FilterTooltipPosition.left : FilterTooltipPosition.right;
  const style: React.CSSProperties = {
    top: `${top}px`,
    left: `${showLeft ? left : left + ticketWidth}px`,
  };

  const closeTooltip = () => closeFilterTooltipAction(dispatch);

  const applyFilters = () => {
    closeTooltip();

    if(unusedFilter) {
      unusedFilter.handleFilter();
    }
    if(linkedFilter) {
      linkedFilter.handleFilter();
    }
  };

  const removeAllFilters = () => {
    closeTooltip();
    removeFilterAction(dispatch);
  };

  return (
    <div>
      <Overlay zIndex={OverlayZIndex.Tooltip} onClick={closeTooltip} />
      <div className={cx(styles.tooltip, filterTooltipPositionMap[position])} style={style}>
        <span className={styles.title}>Filter by:</span>
        {linkedFilter && linkedFilter.Component}
        {unusedFilter && unusedFilter.Component}
        <div className={styles.footer}>
          {withRemoveAllButton && (
            <button onClick={removeAllFilters}>Remove all</button>
          )}
          <button onClick={applyFilters}>Apply</button>
        </div>
      </div>
    </div>
  );
};
