import React from "react";
import cx from "classnames";
import * as styles from "./checkbox.less";

export interface CheckBoxProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

export class Checkbox extends React.PureComponent<CheckBoxProps> {
  public render () {
    const { isChecked , text, onChange} = this.props;
    return (
      <label className={cx(styles.label, isChecked && styles.checked)}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
        />
        <span className={styles.text}>{text}</span>
      </label>
    );
  }
}
