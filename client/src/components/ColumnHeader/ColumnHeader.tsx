import React from "react";
import * as styles from "./columnHeader.less";
import { ColumnType } from "../../types";
import { plusSvg } from "../Svg/Svg";
import { FormManagerState } from "../ColumnsManager/types";

interface ColumnHeaderProps {
  type: ColumnType;
  openForm: (props: FormManagerState) => void;
}

export const ColumnHeader = React.memo(({ type, openForm }: ColumnHeaderProps) => {
  return (
    <div className={styles.header} onClick={() => openForm({ formOpened: type })}>
      <span className={styles.name}>{type}</span>
      <div className={styles.add}>
        {plusSvg}
      </div>
    </div>
  );
});
