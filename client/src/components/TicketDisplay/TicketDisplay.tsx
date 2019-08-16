import React, { useContext } from "react";
import cx from "classnames";
import * as styles from "./ticketDisplay.less";
import { TicketData, CommonFields, ColumnType } from "../../types";
import { editSvg, trashSvg, filterSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { openFilterTooltipAction } from "../ColumnsManager/actions";
import { FormManagerState } from "../ColumnsManager/types";
import { FilterType } from "../FilterTooltip/FilterTooltip";

const formatDisplayFields = (data: TicketData, key: string) => {
  if(!data.hasOwnProperty(key)) {
    return null;
  }
  let value = null;
  if(
    data[key] === null
    || data[key] === undefined
    || typeof data[key] === "string" && !data[key].length
  ) {
    value = "-";
  } else if(typeof data[key] === "object") {
    const res = data[key].map(({ name }: { name: string }) => name).join(", ");
    value = res.length ? res : "-";
  } else {
    value = data[key].toString().replace(";", " ");
  }
  return value;
};

export enum DisplayDirection {
  column = "column",
  row = "row",
}

const displayDirectionMap = {
  [DisplayDirection.column]: styles.column,
  [DisplayDirection.row]: styles.row
};

export interface TicketDisplayProps {
  openForm: (props: FormManagerState) => void;
  data: TicketData;
  deleteTicket: (data: CommonFields) => void;
  openTextArea: () => void;
  displayFields: string[];
  displayDirection: DisplayDirection;
  type: ColumnType;
}

export const TicketDisplay: React.FC<TicketDisplayProps> = ({
  openTextArea,
  deleteTicket,
  data,
  openForm,
  displayFields,
  displayDirection,
  type,
}) => {
  const ref = React.createRef<HTMLDivElement>();
  const { dispatch } = useContext(ReducerContext);

  const showFilterOptions = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if(!ref.current) {
      return;
    }
    const { left, top, width } = ref.current.getBoundingClientRect();
    openFilterTooltipAction(dispatch, {
      top,
      left,
      ticketWidth: width,
      filters: [FilterType.linked],
      withRemoveAllButton: false,
    });
  };

  const editName = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    openTextArea();
  };

  const removeTicket = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { id, name } = data;
    deleteTicket({ id, name });
  };

  const renderDisplayedValues = () => {
    return displayFields.map((key, i) => (
      <div key={i} className={cx(styles.displayRow, displayDirectionMap[displayDirection])}>
        <small className={styles.key}>{key}:</small>
        <span>{formatDisplayFields(data, key)}</span>
      </div>
    ));
  };

  return (
    <div className={styles.container} onClick={() => openForm({ formOpened: type, formProps: data })} ref={ref}>
      {renderDisplayedValues()}
      <div className={styles.options}>
        <div className={styles.icon} onClick={editName}>
          {editSvg}
        </div>
        <div className={styles.icon} onClick={removeTicket}>
          {trashSvg}
        </div>
        <div className={styles.icon} onClick={showFilterOptions}>
          {filterSvg}
        </div>
      </div>
    </div>
  );
};
