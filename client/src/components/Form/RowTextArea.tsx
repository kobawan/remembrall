import React from "react";
import * as styles from "./rowTextArea.less";
import { RowProps } from "./types";
import { FormRow } from "./FormRow";

export const RowTextArea = React.memo(({ name, value, onChange }: RowProps) => {
  return (
    <FormRow name={name}>
      <textarea
        name={name}
        onChange={onChange}
        value={value}
        className={styles.input}
      />
    </FormRow>
  );
});
