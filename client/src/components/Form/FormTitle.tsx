import React, { useState, useCallback } from "react";
import cx from "classnames";
import * as styles from "./formTitle.less";
import { RowProps } from "./types";
import { FormSize } from "./Form";

const TITLE_ERROR_MSG = "Invalid input. Title field is required";

interface FormTitleProps extends RowProps {
  placeholder?: string;
  size: FormSize;
}

const formSizeMap = {
  [FormSize.small]: styles.small,
  [FormSize.medium]: styles.medium,
  [FormSize.large]: styles.large,
};

export const FormTitle = React.memo(({
  name,
  value,
  onChange,
  placeholder,
  size,
}: FormTitleProps) => {
  const [ showError, setShowError ] = useState(false);

  const onBlur = useCallback(() => {
    if(value.length === 0 && !showError) {
      setShowError(true);
    }
  }, [value, showError]);

  const onFocus = useCallback(() => {
    if(showError) {
      setShowError(false);
    }
  }, [showError]);

  return (
    <div className={cx(styles.title, formSizeMap[size])}>
      <input
        type="text"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        className={cx(styles.input, showError && styles.error)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <div className={styles.inputError}>
        {showError && TITLE_ERROR_MSG}
      </div>
    </div>
  );
});
