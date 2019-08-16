import React, { useContext } from "react";
import cx from "classnames";
import * as styles from "./filterButtonMain.less";
import { filterSvg, filterActiveSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { openFilterTooltipAction } from "../ColumnsManager/actions";

export const MainFilterButton: React.FC = () => {
  const { state: { filterTooltipState: { activeFilters} }, dispatch } = useContext(ReducerContext);
  const ref = React.createRef<HTMLButtonElement>();

  const showFilterOptions = () => {
    if(!ref.current) {
      return;
    }
    const { left, top, width } = ref.current.getBoundingClientRect();
    openFilterTooltipAction(dispatch, {
      top,
      left,
      ticketWidth: width,
    });
  };

  return (
    <button
      className={cx(styles.button, activeFilters.length && styles.active)}
      onClick={showFilterOptions}
      ref={ref}
    >
      {activeFilters.length ? filterActiveSvg : filterSvg}
    </button>
  );
};
