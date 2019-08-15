import React from "react";
import cx from "classnames";
import * as styles from "./formRow.less";

interface FormRowProps {
  name: string;
  isRequired?: boolean;
  direction?: FormRowDirection;
}

export enum FormRowDirection {
  row = "row",
  column = "column",
}

const formRowDirectionMap = {
  [FormRowDirection.row]: styles.row,
  [FormRowDirection.column]: styles.column,
};

export const FormRow: React.FC<FormRowProps> = (({
  name,
  isRequired,
  direction = FormRowDirection.row,
  children,
}) => {
  return (
    <div className={styles.row}>
      <label className={styles.label}>{`${name}${isRequired ? " *" : ""}`}</label>
      <div className={cx(styles.content, formRowDirectionMap[direction])}>
        {children}
      </div>
    </div>
  );
});
