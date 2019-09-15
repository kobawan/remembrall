import React, { useContext } from "react";
import cx from "classnames";
import * as styles from "./ticketDisplay.less";
import {
  AllColumnFields,
  CommonFields,
  ColumnType,
  TempAnyObject,
  ProjectFieldWithAmountUsed,
  InProjectField,
} from "../../types";
import { editSvg, trashSvg, filterSvg } from "../Svg/Svg";
import { ReducerContext } from "../ColumnsManager/context";
import { openFilterTooltipAction } from "../ColumnsManager/actions";
import { FormManagerState } from "../ColumnsManager/types";
import { FilterType } from "../FilterTooltip/FilterTooltip";
import { getTagDisplayValue } from "../../utils/getTagDisplayValue";

const formatSimpleDisplayField = (data: TempAnyObject, key: string) => {
  if(!data.hasOwnProperty(key)) {
    return null;
  }
  if(
    data[key] === null
    || data[key] === undefined
    || typeof data[key] === "string" && !data[key].length
  ) {
    return "-";
  }
  if(Array.isArray(data[key])) {
    const res = data[key].map(({ name }: { name: string }) => name).join(", ");
    return res.length ? res : "-";
  }
  return data[key].toString().replace(";", " ");
};

const formatComplexDisplayField = (data: TempAnyObject, key: Record<string, string[]>) => {
  const field = Object.keys(key)[0];
  const displayedValues = key[field] as (keyof CommonFields)[];
  const res = (data[field] as ProjectFieldWithAmountUsed<CommonFields>[])
    .map(({ entry, amountUsed }) => ({
      text: getTagDisplayValue(displayedValues, entry),
      amountUsed,
    }));
  return res.length ? res : "-";
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
  data: AllColumnFields;
  deleteTicket: (data: CommonFields) => void;
  openTextArea: () => void;
  displayFields: (string | Record<string, string[]>)[];
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
  const { state: { filterTooltipState: { activeFilters } }, dispatch } = useContext(ReducerContext);
  const isLocalFilterActive = activeFilters.some(({ type }) => type === FilterType.linked);

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
      ticket: data as CommonFields & InProjectField,
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

  const renderSimpleDisplay = (key: string) => {
    return (
      <>
        <small className={styles.key}>{key}:</small>
        <span>{formatSimpleDisplayField(data, key)}</span>
      </>
    );
  };

  const renderComplexDisplay = (key: Record<string, string[]>) => {
    const res = formatComplexDisplayField(data, key);
    return (
      <>
        <small className={styles.key}>{Object.keys(key)[0]}:</small>
        {typeof res === "string"
          ? <span>{res}</span>
          : res.map(({ text, amountUsed }, i) => (
            <span key={i}>
              {text}
              <span style={{ color: "gray", fontWeight: 600, fontSize: "0.8em" }}>
                &nbsp;&nbsp;x {amountUsed}
              </span>
            </span>
          ))
        }
      </>
    );
  };

  const renderDisplayedValues = () => {
    return displayFields.map((key, i) => (
      <div key={i} className={cx(styles.displayRow, displayDirectionMap[displayDirection])}>
        {typeof key === "string" ? renderSimpleDisplay(key) : renderComplexDisplay(key)}
      </div>
    ));
  };

  return (
    <div className={styles.container} onClick={() => openForm({ formOpened: type, formProps: data })} ref={ref}>
      {renderDisplayedValues()}
      <div className={cx(styles.options, isLocalFilterActive && styles.active)}>
        <div className={cx(styles.icon, styles.filter)} onClick={showFilterOptions}>
          {filterSvg}
        </div>
        <div className={styles.icon} onClick={editName}>
          {editSvg}
        </div>
        <div className={styles.icon} onClick={removeTicket}>
          {trashSvg}
        </div>
      </div>
    </div>
  );
};
