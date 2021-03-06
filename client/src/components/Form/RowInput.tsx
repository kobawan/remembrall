import React from "react";
import * as styles from "./rowInput.less";
import { RowProps } from "./types";
import { FormRow } from "./FormRow";

interface RowInputProps extends RowProps {
  type?: string;
  autofocus?: boolean;
}

export const RowInput = React.memo(({ name, value, onChange, type, autofocus }: RowInputProps) => {
  return (
    <FormRow name={name}>
      <input
        type={type ? type : "text"}
        name={name}
        onChange={onChange}
        value={value}
        autoFocus={!!autofocus}
        className={styles.input}
        min={type === "number" ? 0 : undefined}
      />
    </FormRow>
  );
});
