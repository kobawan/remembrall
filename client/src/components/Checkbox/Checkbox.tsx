import * as React from "react";
import "./checkbox.less";

export interface CheckBoxProps {
  text: string;
  isChecked: boolean;
  onChange: () => void;
}

export class Checkbox extends React.PureComponent<CheckBoxProps> {
  public render () {
    const { isChecked , text, onChange} = this.props;
    return (
      <label className={`checkbox-label ${isChecked ? "checked" : ""}`}>
        <input
          className="checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={onChange}
        />
        <span>{text}</span>
      </label>
    );
  }
}
