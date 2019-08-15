import React, { useContext } from "react";
import * as styles from "./filterButtonMain.less";
import { removeFilterSvg, filterSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { removeFilterAction } from "../ColumnsManager/actions";

export const MainFilterButton: React.FC = () => {
  const { state: { filterTooltipState }, dispatch } = useContext(ReducerContext);

  // @todo add logic
  return (
    <button className={styles.button} onClick={() => removeFilterAction(dispatch)}>
      {filterTooltipState.activeFilters.length ? removeFilterSvg: filterSvg}
    </button>
  );
};
